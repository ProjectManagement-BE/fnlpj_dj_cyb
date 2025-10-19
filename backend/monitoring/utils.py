from scapy.all import sniff, IP
import json
import requests
import re
import ipaddress
from datetime import datetime, timezone

def capture_packets(count=10):
    """
    Capture a small number of packets (default 10)
    and return a summary.
    Works on Windows with Npcap installed.
    """
    results = []

    try:
        packets = sniff(count=count, timeout=5)
        for pkt in packets:
            src = None
            dst = None
            proto = None
            if IP in pkt:
                src = pkt[IP].src
                dst = pkt[IP].dst
                proto = pkt[IP].proto
            else:
                # Skip non-IP traffic for threat list
                continue
            pkt_summary = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "src": src or "N/A",
                "dst": dst or "N/A",
                "protocol": str(proto) if proto is not None else "N/A",
            }
            results.append(pkt_summary)

    except Exception as e:
        # Return empty on error to avoid fake data
        return {"error": str(e), "captured": []}

    return {"captured": results}


def analyze_ip_address(ip_address: str) -> dict:
    """
    Query public IP intel to provide geolocation and basic risk context.
    Uses ip-api.com (free) and optionally AbuseIPDB if API key exists.
    """
    result = {"ip": ip_address}

    # Basic IPv4 validation to avoid external calls on invalid input
    if not re.match(r"^(?:\d{1,3}\.){3}\d{1,3}$", ip_address or ""):
        result["error"] = "Invalid IP format"
        return result

    # Private/local IPs are not in public reputation DBs
    try:
        ip_obj = ipaddress.ip_address(ip_address)
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_reserved or ip_obj.is_link_local:
            result.update({
                "risk": "unknown",
                "note": "Private/local IP ranges are not checked against public reputation databases.",
            })
            return result
    except Exception:
        pass

    try:
        geo_resp = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=6)
        if geo_resp.ok:
            geo = geo_resp.json()
            result.update({
                "country": geo.get("country"),
                "region": geo.get("regionName"),
                "city": geo.get("city"),
                "org": geo.get("org"),
                "asn": geo.get("as"),
                "lat": geo.get("lat"),
                "lon": geo.get("lon"),
            })
    except Exception as e:
        result["geo_error"] = str(e)

    # Optional AbuseIPDB
    try:
        import os
        abuse_key = os.getenv("ABUSEIPDB_API_KEY")
        if abuse_key:
            abuse_resp = requests.get(
                "https://api.abuseipdb.com/api/v2/check",
                params={"ipAddress": ip_address, "maxAgeInDays": 90},
                headers={"Key": abuse_key, "Accept": "application/json"},
                timeout=6,
            )
            if abuse_resp.ok:
                data = abuse_resp.json().get("data", {})
                result.update({
                    "abuse_score": data.get("abuseConfidenceScore"),
                    "total_reports": data.get("totalReports"),
                    "last_reported_at": data.get("lastReportedAt"),
                    "usage_type": data.get("usageType"),
                    "isp": data.get("isp"),
                })
    except Exception as e:
        result["abuse_error"] = str(e)

    # Simple risk label
    score = result.get("abuse_score")
    if isinstance(score, int):
        if score >= 75:
            result["risk"] = "critical"
        elif score >= 40:
            result["risk"] = "high"
        elif score >= 10:
            result["risk"] = "medium"
        else:
            result["risk"] = "low"
    else:
        result["risk"] = "unknown"

    return result

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from openai import OpenAI
import os
from dotenv import load_dotenv

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ⚡ Directly use your API key here

client = OpenAI(api_key=OPENAI_API_KEY)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chatbot_query(request):
    """Chatbot endpoint using OpenAI GPT"""
    query = request.data.get("query", "")

    if not query:
        return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # you can use "gpt-3.5-turbo" if cheaper
            messages=[
                {
                    "role": "system",
                    "content": "You are a cybersecurity assistant. Always respond clearly and explain things in the context of a Cyber Threat Detection project."
                },
                {"role": "user", "content": query},
            ],
        )
        response_text = completion.choices[0].message.content
    except Exception as e:
        response_text = f"Error: {str(e)}"

    return Response({"query": query, "response": response_text})


# Optional: APIView for future flexibility
class ChatbotView(APIView):
    def post(self, request):
        question = request.data.get("message", "")

        if not question:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a cybersecurity assistant. Explain clearly in relation to the Cyber Threat Detection project."
                    },
                    {"role": "user", "content": question},
                ],
            )
            answer = completion.choices[0].message.content
        except Exception as e:
            answer = f"Error: {str(e)}"

        return Response({"response": answer}, status=status.HTTP_200_OK)

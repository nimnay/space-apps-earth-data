import google.generativeai as genai
from config import GEMINI_API_KEY

class AeroGuardAI:
    def __init__(self):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro-latest')
    
    def _clean_response(self, text):
        # Remove markdown bullets and formatting
        lines = text.strip().split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove markdown bullets and formatting
            line = line.strip()
            if line.startswith('•'):
                line = '- ' + line[1:].strip()
            elif line.startswith('*'):
                line = '- ' + line[1:].strip()
            elif line.startswith('1.'):
                line = '- ' + line[2:].strip()
                
            # Keep emojis but remove other markdown
            if line:
                cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)
    
    def get_wildfire_advice(self, location, user_context=""):
        prompt = f"""
        You are AeroGuard - emergency air quality assistant for Upstate SC.
        
        USER SITUATION: {location}. {user_context}
        
        RESPONSE FORMAT:
        🚨 SMOKE ALERT: [Location]
        
        IMMEDIATE ACTIONS:
        • [Action 1 with reason]
        • [Action 2 with reason]
        
        HEALTH PRECAUTIONS:
        • [Group-specific advice]
        
        SAFETY ZONES:
        ✅ Safe: [Areas]
        🚫 Avoid: [Areas]
        
        ⏰ TIMELINE: [What to expect]
        
        Keep under 200 words. Be specific about Upstate SC locations.
        """
        
        response = self.model.generate_content(prompt)
        return self._clean_response(response.text)
    
    def get_pollution_advice(self, location, activity, user_context=""):
        prompt = f"""
        You are AeroGuard - daily air quality advisor for Upstate SC.
        
        USER SITUATION: {location}. Planning: {activity}. {user_context}
        
        RESPONSE FORMAT:
        🌫️ AIR QUALITY ADVISORY: [Location]
        
        ACTIVITY GUIDANCE:
        • [Timing recommendations]
        • [Alternative options]
        
        HEALTHY ROUTES:
        ✅ Clean air: [Routes]
        🚫 High pollution: [Areas]
        
        HEALTH TIPS:
        • [Specific advice]
        
        Keep under 200 words. Suggest real Upstate SC locations.
        """
        
        response = self.model.generate_content(prompt)
        return self._clean_response(response.text)
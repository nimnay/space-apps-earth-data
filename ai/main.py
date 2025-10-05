from gemini_wrapper import AeroGuardAI

def main():
    ai = AeroGuardAI()
    
    print("=== AEROGUARD AI TEST ===")
    
    # Test Wildfire Scenario
    print("\n🔥 TESTING WILDFIRE MODE:")
    wildfire_response = ai.get_wildfire_advice(
        "Pickens County", 
        "Wildfire near Table Rock, smoke moving toward Clemson. I have asthma."
    )
    print(wildfire_response)
    
    # Test Pollution Scenario  
    print("\n🌫️ TESTING POLLUTION MODE:")
    pollution_response = ai.get_pollution_advice(
        "Greenville downtown",
        "evening run at 5 PM",
        "I have mild asthma and work near the highway."
    )
    print(pollution_response)

if __name__ == "__main__":
    main()
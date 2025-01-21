export default class PromptManager{
      

  checkIfTired(createdAt) {
    const hour = new Date(createdAt).getHours();

    if (hour  < 18) {
      return {
        text: "It’s quite late. Do you think this might affect your decision-making?",
        options: ["Yes, I feel tired", "No, I feel fine"],
        type: "prompt",
      };
    }

    return null;
  }


}
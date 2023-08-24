import openai from "openai";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const client = new openai({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    async function main() {
      const completion = await client.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: "gpt-3.5-turbo",
      });

      console.log(completion, completion.choices);
    }
    // main();
    console.log(
      openai,
      process.env.NEXT_PUBLIC_OPENAI_ORG_ID,
      process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    );
  }, []);

  return <div>chat</div>;
};

export default Index;

import Moralis from "moralis";

const config = {
  domain: process.env.APP_DOMAIN!,
  statement: "Please sign this message to confirm your identity.",
  uri: process.env.NEXTAUTH_URL!,
  timeout: 60,
};
console.log("Config", config);

export default async function handler(req: any, res: any) {
  debugger;
  const { address, chain, network } = req.body;

  await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });

  try {
    debugger;
    const message = await Moralis.Auth.requestMessage({
      address,
      chain,
      network,
      ...config,
    });

    res.status(200).json(message);
  } catch (error) {
    debugger;
    res.status(400).json({ error });
    console.error(error);
  }
}
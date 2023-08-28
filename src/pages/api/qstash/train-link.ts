import { type NextApiRequest, type NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { trainLink } from "@/server/training";

/*
This function will get called from qstash when a user adds a new link to a project;
*/
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { linkId } = req.body;

  if (!linkId) {
    return res.status(400).send("Link id not found");
  }

  try {
    await trainLink(linkId);
    return res.status(200).end();
  } catch (error) {
    return res.status(500).end();
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default verifySignature(handler);

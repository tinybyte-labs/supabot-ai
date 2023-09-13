export type IpInfo = {
  ip: string;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  loc?: string | null;
  org?: string | null;
  postal?: string | null;
  timezone?: string | null;
  bogon?: boolean | null;
  anycast?: boolean | null;
};

export const getIpInfo = async (ip: string): Promise<IpInfo | null> => {
  const res = await fetch(
    `https://ipinfo.io/${ip}?token=${process.env.IPINFO_KEY}`,
  );
  console.log({ res });
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data;
};

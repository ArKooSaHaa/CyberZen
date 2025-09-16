import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const hdr = req.headers.authorization || ""; // Bearer token generate hoise
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null; // token ta ber kore nilam
  if (!token) return res.status(401).json({ message: "Missing token" }); // token na thakle 401
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // token verify korlam
    req.userId = payload.sub;               // set user id for controllers
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

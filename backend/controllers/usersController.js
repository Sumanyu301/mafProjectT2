import prisma from "../prismaClient.js";

export async function getUserById(req, res){
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { employee: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

export async function updateUserById(req, res){
  const { email } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { email },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// ------------------------------------------------------------------------------------------------------------

export async function deleteUserById(req, res) {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
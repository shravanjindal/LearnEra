import dbConnect from '@/lib/dbConnect';
import {User, IUser } from '@/models/user';

export async function GET(req:Request) {
  await dbConnect();
  try {
    const users: IUser[] = await User.find({});
    return Response.json({ success: true, data: users });
  } catch (error) {
    return Response.json({ success: false });
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/authUtils';
import { UserSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validation
    const result = UserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { name, email, password } = result.data;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: 'User registered successfully. Please sign in.',
    }, { status: 201 });

  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

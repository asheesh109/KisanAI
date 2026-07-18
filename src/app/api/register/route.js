import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'farmer',
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}

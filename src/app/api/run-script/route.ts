import { NextResponse } from "next/server";
import { exec } from "child_process";
import { MongoClient } from "mongodb";
import { promisify } from "util";

const execPromise = promisify(exec);
const uri = "mongodb://localhost:27017/twitter_trends";
const client = new MongoClient(uri);

export async function GET() {
  try {
    await execPromise("python selenium_script.py");

    await client.connect();
    const database = client.db("twitter_trends");
    const collection = database.collection("trends");
    const latestEntry = await collection
      .find()
      .sort({ end_time: -1 })
      .limit(1)
      .toArray();

    if (latestEntry.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No data found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(latestEntry[0]), { status: 200 });
  } catch (error) {
    console.error(`Error: ${error}`);
    return new NextResponse(
      JSON.stringify({ error: "Error running script or fetching data" }),
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

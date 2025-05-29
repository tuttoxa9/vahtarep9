import { NextResponse } from "next/server";
import { getAllVacancies } from "@/lib/firestore";

export async function GET() {
  try {
    const vacancies = await getAllVacancies();

    // Сериализуем данные для клиента
    const serializedVacancies = JSON.parse(JSON.stringify(vacancies));

    // Простой ответ без сложного кэширования
    return NextResponse.json(serializedVacancies);
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    return NextResponse.json(
      { error: "Failed to fetch vacancies" },
      { status: 500 }
    );
  }
}

// Добавляем runtime для serverless функций
export const runtime = 'nodejs';

// Не кэшируем этот route статически
export const dynamic = 'force-dynamic';

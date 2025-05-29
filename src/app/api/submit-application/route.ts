import { type NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Инициализация Firebase
let app: any;
let db: any;

try {
  const apps = getApps();
  if (apps.length > 0) {
    app = apps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firebase not initialized' },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const body = await request.json();
    const { vacancyId, applicantName, applicantPhone, applicantEmail, message } = body;

    // Валидация обязательных полей
    if (!vacancyId || !applicantName || !applicantPhone) {
      return NextResponse.json(
        { error: 'Missing required fields: vacancyId, applicantName, applicantPhone' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // 1. Сохраняем заявку в Firestore
    const applicationData = {
      vacancyId: vacancyId,
      applicantName: applicantName,
      applicantPhone: applicantPhone,
      applicantEmail: applicantEmail || '',
      message: message || '',
      createdAt: Timestamp.now(),
      status: 'new'
    };

    console.log('Attempting to save to Firestore:', applicationData);
    const docRef = await addDoc(collection(db, 'applications'), applicationData);
    const applicationId = docRef.id;
    console.log('Successfully saved application with ID:', applicationId);

    // 2. Получаем данные вакансии для отправки в Telegram
    let vacancy = null;
    try {
      const vacancyDoc = await getDoc(doc(db, 'vacancies', vacancyId));
      if (vacancyDoc.exists()) {
        vacancy = {
          id: vacancyDoc.id,
          ...vacancyDoc.data()
        };
      }
    } catch (vacancyError) {
      console.error('Error fetching vacancy:', vacancyError);
    }

    // 3. Отправляем уведомление в Telegram (если настроен корректный Chat ID)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID && TELEGRAM_CHAT_ID !== '7822840897') {
      try {
        // Форматируем зарплату
        const formatSalary = (salary: any) => {
          if (!salary) return 'не указана';
          if (typeof salary === 'string') return salary;
          if (typeof salary === 'object') {
            const { min, max, currency = 'руб' } = salary;
            if (!min && !max) return 'по договоренности';
            if (!min) return `до ${max} ${currency}`;
            if (!max) return `от ${min} ${currency}`;
            return `${min} - ${max} ${currency}`;
          }
          return String(salary);
        };

        // Форматируем сообщение для Telegram
        const telegramMessage = `🔔 *Новая заявка на вакансию!*

📋 *Вакансия:* ${vacancy ? vacancy.title : `ID: ${vacancyId}`}
${vacancy ? `🏢 *Компания:* ${vacancy.company || 'не указана'}` : ''}
${vacancy ? `📍 *Локация:* ${vacancy.location || 'не указана'}` : ''}
${vacancy ? `💰 *Зарплата:* ${formatSalary(vacancy.salary)}` : ''}

👤 *Соискатель:*
• Имя: ${applicantName}
• Телефон: ${applicantPhone}
• Email: ${applicantEmail || 'не указан'}
• Сообщение: ${message || 'не указано'}

🆔 ID заявки: ${applicationId}
🆔 ID вакансии: ${vacancyId}

⏰ Дата подачи: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

        // Отправляем сообщение в Telegram
        const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown',
          }),
        });

        if (!telegramResponse.ok) {
          const errorData = await telegramResponse.text();
          console.error('Telegram API error:', errorData);
        } else {
          console.log('✅ Telegram notification sent successfully');
        }
      } catch (telegramError) {
        console.error('Error sending Telegram notification:', telegramError);
      }
    } else {
      console.warn('Telegram credentials not configured correctly');
    }

    // Возвращаем успешный ответ
    return NextResponse.json({
      success: true,
      applicationId: applicationId,
      message: 'Application submitted successfully'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      {
        error: 'Failed to process application',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

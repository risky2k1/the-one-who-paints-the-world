import { isoFaces, type IsoFace } from '@/shared/three';
import type { Prompt } from '@/shared/api/kids/kids.types';


export interface PrintableQuestion {
  number: number;
  promptText: string;
  isoFaces?: IsoFace[];
  answer: string;
  solutionSteps: string[];
}

export interface PrintableWorksheet {
  title: string;
  childName?: string;
  grade?: number;
  dateStr: string;
  questions: PrintableQuestion[];
}

export interface BuildWorksheetOptions {
  title: string;
  childName?: string;
  grade?: number;
  questions: Array<{
    id: number;
    prompt: Prompt;
    answer?: string;
    solution?: string[];
  }>;
}

export function buildWorksheetData({
  title,
  childName,
  grade,
  questions,
}: BuildWorksheetOptions): PrintableWorksheet {
  const formattedQuestions: PrintableQuestion[] = questions.map((q, idx) => {
    let promptText = '';
    let faces: IsoFace[] | undefined;

    switch (q.prompt.type) {
      case 'arithmetic':
        promptText = q.prompt.text;
        break;
      case 'comparison':
        promptText = `${q.prompt.left} ... ${q.prompt.right}  (Điền >, < hoặc =)`;
        break;
      case 'word_problem':
        promptText = q.prompt.text;
        break;
      case 'cube_count':
        promptText = 'Có tất cả bao nhiêu khối lập phương trong hình dưới đây?';
        faces = isoFaces(q.prompt.heights);
        break;
      default:
        promptText = 'Câu hỏi Toán';
    }

    return {
      number: idx + 1,
      promptText,
      isoFaces: faces,
      answer: q.answer || '',
      solutionSteps: q.solution || [],
    };
  });

  return {
    title,
    childName,
    grade,
    dateStr: new Date().toLocaleDateString('vi-VN'),
    questions: formattedQuestions,
  };
}

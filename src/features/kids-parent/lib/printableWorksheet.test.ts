import { describe, expect, it } from 'vitest';
import type { Prompt } from '@/shared/api/kids/kids.types';
import { buildWorksheetData } from './printableWorksheet';

describe('printableWorksheet logic', () => {
  it('formats questions correctly and separates answers from questions', () => {
    const rawQuestions: Array<{ id: number; prompt: Prompt; answer: string; solution: string[] }> = [
      {
        id: 1,
        prompt: { type: 'arithmetic', text: '35 + 47 = ?', input: 'number' },
        answer: '82',
        solution: ['30 + 40 = 70', '5 + 7 = 12', '70 + 12 = 82'],
      },
      {
        id: 2,
        prompt: { type: 'comparison', left: '45', right: '54', choices: ['<', '=', '>'] },
        answer: '<',
        solution: ['45 nhỏ hơn 54'],
      },
      {
        id: 3,
        prompt: { type: 'word_problem', text: 'Nam có 12 viên bi, cho bạn 5 viên bi. Hỏi Nam còn lại bao nhiêu viên bi?', unit: 'viên bi', input: 'number' },
        answer: '7',
        solution: ['12 - 5 = 7 viên bi'],
      },
    ];

    const data = buildWorksheetData({
      title: 'Bài tập ôn hè',
      childName: 'Bo',
      grade: 2,
      questions: rawQuestions,
    });

    expect(data.title).toBe('Bài tập ôn hè');
    expect(data.childName).toBe('Bo');
    expect(data.grade).toBe(2);
    expect(data.questions.length).toBe(3);

    // Question 1
    expect(data.questions[0].number).toBe(1);
    expect(data.questions[0].promptText).toBe('35 + 47 = ?');
    expect(data.questions[0].answer).toBe('82');
    expect(data.questions[0].solutionSteps.length).toBe(3);

    // Question 2
    expect(data.questions[1].promptText).toBe('45 ... 54  (Điền >, < hoặc =)');
  });

  it('renders cube count questions with isometric svg faces', () => {
    const rawQuestions = [
      {
        id: 4,
        prompt: { type: 'cube_count' as const, heights: [[2, 1]] },
        answer: '3',
        solution: ['Hàng 1 có 2 + 1 = 3 khối'],
      },
    ];

    const data = buildWorksheetData({
      title: 'Đếm khối',
      childName: 'Bi',
      grade: 2,
      questions: rawQuestions,
    });

    expect(data.questions[0].promptText).toBe('Có tất cả bao nhiêu khối lập phương trong hình dưới đây?');
    expect(data.questions[0].isoFaces).toBeDefined();
    expect(data.questions[0].isoFaces!.length).toBeGreaterThan(0);
  });
});

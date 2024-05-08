import { NextRequest, NextResponse } from "next/server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import saveQuizz from "./saveToDb";


export async function POST(req: NextRequest) {
  const body = await req.formData();
  const document = body.get("pdf");

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
        parsedItemSeparator: " ",
    });

    const docs = await pdfLoader.load();

    const selectedDocument = docs.filter((doc) => doc.pageContent !== undefined);

    const texts = selectedDocument.map((doc) => doc.pageContent);

    const prompt = "given the text which is a summary of the document, generate a quiz based on the text. Return json only that contains a quizz object with fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers is an array of objects with fields: answerText, isCorrect.";
    
    if(!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 });
    }

    const model = new ChatOpenAI({
      modelName: "gpt-4-turbo-2024-04-09",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const parser = new JsonOutputFunctionsParser();

    const extractionFunctionSchema = {
        name: "extractor",
        description: "Extracts fields from the output",
        parameters: {
          type: "object",
          properties: {
            quizz: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      questionText: { type: "string" },
                      answers: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            answerText: { type: "string" },
                            isCorrect: { type: "boolean" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
    };

    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    const messages = new HumanMessage({
      content: [
        {
            type:"text",
            text: prompt + "\n" + texts.join("\n"),
        },
      ],
    });

    

    const result: any = await runnable.invoke([messages]);
    console.log(result);

    const { quizzId } = await saveQuizz(result.quizz);

    return NextResponse.json({ quizzId }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}
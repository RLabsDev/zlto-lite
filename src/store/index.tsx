import createStore from "teaful";

interface TaskQuestion {
  id: number;
  title: string;
  sub_title: string;
  description: string;
  is_mandatory: boolean;
  question_attachments: {
    attachment_type: number;
    attachment_src: string;
    attachment: string;
  }[];
  question_type: number;
  question_type_verbose: string;
  answer_type_verbose: string;
  question_number: number;
  choices: string;
}

interface Task {
  details: {
    id: number;
    title: string;
    amount: number;
    banner_pic: string;
    ending_message: string;
  };
  questions: TaskQuestion[];
}

interface User {
  name: string;
  surname: string;
  id: string;
  cell_number: string;
  email: string;
  dob: string;
  about_me: string;
}

let { useStore } = createStore({
  token: "",
  user: {} as User,
  tasks: [] as any,
  taskInFocus: {} as Task,
  stores: [],
  products: [],
  zltoBalance: 0,
});

export { useStore };

import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Todo = {
  id: number;
  content: string;
  complete: boolean;
}

export type FilteredTodos = {
  notDone: Todo[],
  done: Todo[]
}
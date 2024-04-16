import React, { useState } from 'react'

import { Spinner } from '@nextui-org/spinner';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { TodoOptions } from '@/components';
import { Todo } from '@/types';

type Props = {
  key: any,
  todo: Todo;
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

const TodoItem = ({ key, todo, todos, setTodos }: Props) => {

  const [complete, setComplete] = useState(todo?.complete);
  const [content, setContent] = useState(todo?.content);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  async function updateTodoCompletion() {
    try {
      setLoading(true)
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: todo.content,
          complete: !complete
        })
      });

      if (response.ok) {

        const { data } = await response.json();
        let updatedTodos = [...todos];
        let todoIndex = updatedTodos.findIndex((t) => t.id == todo.id);
        updatedTodos[todoIndex] = data;
        setTimeout(() => {
          setTodos(updatedTodos)
          setLoading(false);
        }, 1000)

      }
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function updateTodoContent() {
    try {
      setLoading(true)
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: content,
          complete: todo.complete
        })
      });

      if (response.ok) {

        const { data } = await response.json();
        let updatedTodos = [...todos];
        let todoIndex = updatedTodos.findIndex((t) => t.id == todo.id);
        updatedTodos[todoIndex] = data;
        setTimeout(() => {
          setTodos(updatedTodos)
          setEdit(false);
          setLoading(false);
        }, 1000)

      }
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }




  return (
    <>
      <div className='flex w-full items-center justify-between hover:bg-zinc-800 rounded-lg py-1 px-2 gap-4'>
        <div className='flex gap-2 items-center w-full'>
          <div className='flex justify-start items-center'>
            <input type="checkbox"
              key={key}
              className='w-10'
              checked={complete}
              onChange={() => updateTodoCompletion()}
            />
          </div>
          {
            edit ?
              (<div className='w-full'>
                <Input
                  label=""
                  labelPlacement='outside'
                  placeholder={content}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  size='sm'
                  className='w-full'
                  fullWidth={true}
                  variant='flat'
                />
              </div>) : <div>{todo?.content}</div>
          }

        </div>
        {
          edit ? (
            <Button onPress={updateTodoContent} color='primary' size='sm' >
              Save
            </Button>)
            : <TodoOptions setEdit={setEdit} todoId={todo.id} todos={todos} setTodos={setTodos} />
        }

      </div>
      {loading && (
        <div className="fixed left-0 top-0 w-full h-screen bg-black/70 flex justify-center items-center">
          <Spinner color="white" />
        </div>
      )
      }
    </>

  )
}

export default TodoItem
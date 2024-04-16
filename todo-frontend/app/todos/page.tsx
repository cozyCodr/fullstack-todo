"use client"

import React, { useEffect, useState } from 'react';
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Accordion, AccordionItem } from "@nextui-org/accordion"
import { CreateTodo, TodoItem } from '@/components';
import { Todo, FilteredTodos } from '@/types';

type Props = {}

const Todos = (props: Props) => {
  const [filter, setFilter] = useState("")
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [status, setStatus] = useState<FilteredTodos>({
    notDone: [],
    done: []
  });

  // Fetch Todos on FIrst render
  useEffect(() => {
    fetchTodos();
  }, [])

  // Filter into done and not done
  useEffect(() => {
    if (filteredTodos.length > 0) {
      let notDone = filteredTodos.filter((todo) => todo?.complete != true);
      let done = filteredTodos.filter((todo) => todo?.complete == true);
      setStatus({
        notDone,
        done
      })
    }
  }, [filteredTodos])

  // Filter Todo by search
  useEffect(() => {
    if (filter.length > 3) {
      let filtered = todos.filter((t) => t.content.includes(filter));
      setFilteredTodos(filtered);
      console.log({ filtered })
    }
    else {
      setFilteredTodos(todos);
    }
  }, [filter, todos])


  async function fetchTodos() {
    const response = await fetch("/api/todos");
    if (response.ok) {
      const { data } = await response.json();
      if (data != null && data.length > 0) {
        setTodos(data);
      }
    }
  }

  return (
    <div className='max-w-[800px] w-full flex flex-col gap-5'>

      {/* Top Row */}
      <div className='flex justify-between items-center'>
        <div>Welcome Back!</div>
        <div>
          <CreateTodo todos={todos} setTodos={setTodos} />
        </div>
      </div>

      {/* Todos Filter */}
      <div>
        <Input
          size='md'
          placeholder='filter todos'
          label=""
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          labelPlacement='outside'
          radius='sm'
          fullWidth={true}
        />
      </div>

      {/* List */}
      <Accordion className='px-0 m-0'>
        <AccordionItem className='' key="1" aria-label="Todo" title="Todo">
          {
            status.notDone.length > 0 && status.notDone.map((todo, index) => (
              <TodoItem key={index} todo={todo} todos={filteredTodos} setTodos={setTodos} />
            ))
          }
        </AccordionItem>
        <AccordionItem key="2" aria-label="Done" title="Done">
          {
            status.done.length > 0 && status.done.map((todo, index) => (
              <TodoItem key={index} todo={todo} todos={filteredTodos} setTodos={setTodos} />
            ))
          }
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Todos
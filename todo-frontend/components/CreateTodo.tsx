import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Checkbox } from "@nextui-org/checkbox"
import { Todo } from "@/types";

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void
}

export default function CreateTodo({ todos, setTodos }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [content, setContent] = useState("");
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  async function createTodo() {
    try {
      setLoading(true);
      if (content.length > 0) {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            content,
            complete
          })
        });

        if (response.ok) {
          let { data } = await response.json();
          // Update Todos
          let updatedTodos = [...todos];
          updatedTodos.push(data);
          setTodos(updatedTodos);

          onClose();
          setLoading(false);
        }
        else {
          console.log(await response.json())
          setLoading(false);
        }
      }
    }
    catch (error: any) {
      console.log(error.message)
    }
  }

  async function toggleComplete() {
    setComplete(!complete)
  }

  useEffect(() => {
    console.log(complete);
  }, [complete])

  return (
    <>
      <Button color="primary" radius="sm" onClick={onOpen}>Add Todo</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: any) => (
            <>
              <ModalHeader className="flex flex-col gap-1">New Todo</ModalHeader>
              <ModalBody>
                <div className='flex w-full gap-2 '>
                  <Input
                    variant='bordered'
                    size='md'
                    radius='sm'
                    label=""
                    labelPlacement='outside'
                    placeholder='write ui for todo backend'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    fullWidth
                  />
                  <Checkbox
                    size={"lg"}
                    value={complete.toString()}
                    checked={complete}
                    onChange={toggleComplete}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={createTodo}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {
        loading && (
          <div className="fixed left-0 top-0 w-full h-screen bg-black/70 flex justify-center items-center">
            <Spinner color="white" />
          </div>
        )
      }

    </>
  );
}

import React, { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Todo } from "@/types";


type Props = {
  setEdit: (bool: boolean) => void;
  setTodos: (todos: Todo[]) => void;
  todos: Todo[];
  todoId: number;
}

export default function TodoOptions({ setEdit, todos, todoId, setTodos }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  async function deleteTodo() {
    try {
      setLoading(true)
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        let updatedTodos = [...todos];
        let todoIndex = updatedTodos.findIndex((t) => t.id == todoId);
        if (updatedTodos.length <= 1) {
          updatedTodos = []
        }
        else {
          updatedTodos.splice(todoIndex, 1);
        }

        setTimeout(() => {
          setTodos(updatedTodos)
          setEdit(false);
          onClose()
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
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="light"
            size="sm"
            className="w-[10px] p-0"
          >
            :
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" className="rounded-sm" aria-label="Dropdown menu with description">
          <DropdownItem
            key="edit"
            className="rounded-md"
            onPress={() => setEdit(true)}
          >
            Edit
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="bg-red-600 rounded-md "
            onPress={onOpen}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Task</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this Task?
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={deleteTodo}>
                  Delete
                </Button>
              </ModalFooter>
              {loading && (
                <div className="fixed left-0 top-0 w-full h-screen bg-black/70 flex justify-center items-center">
                  <Spinner color="white" />
                </div>
              )
              }
            </>
          )}

        </ModalContent>
      </Modal>
    </>

  );
}

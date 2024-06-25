import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { service } from 'utils/Service/service';
import { useForm } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';
import { Checkbox } from '@mui/material';
import Confirm from "common/ConfirmModal";
import globalMessages from 'utils/global';
import { Add } from "@mui/icons-material";

interface Todo {
    id: number;
    name: string;
    completed: boolean;
}

const ToDo: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setdeleteId] = useState(0);
    useEffect(() => {
        fetchTodos();
    }, []);

    useEffect(() => {
        console.log("Updated Todos:", todos);
    }, [todos]);

    const fetchTodos = async () => {
        try {
            const userDataResponse = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.profile.getUser,
            });
            console.log("or id" + JSON.stringify(userDataResponse?.data))

            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.todo.fetchToDo,
                params: userDataResponse?.data.data.organization_id
            });
            setTodos(response?.data.data);
            renderTodos(response?.data.data);
        } catch (error) {
            console.error('Error fetching todos:', JSON.stringify(error));
        }
    };
    // function to handle delete of user

    const handleToggleDelete = () => {
        setDeleteOpen((prevState) => !prevState);
        fetchTodos();

    };
    const handledelete = (id: number) => {
        setDeleteOpen(true);
        setdeleteId(id);
    }
    const renderTodos = (todos: Todo[]) => {
        return (

            <MDBox pb={3} ml={3}>
                <ul style={{ position: 'relative' }} >
                    {todos.map((todo) => (
                        <li key={todo.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <Checkbox checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)} />

                            <span style={{ marginLeft: '10px', textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                {todo.name}
                            </span>

                            <MDButton style={{ position: 'absolute', right: '10px' }} variant="gradient" color="error" disabled={todos.length === 0} onClick={() => handledelete(todo.id)} >
                                Delete
                            </MDButton>
                        </li>
                    ))}
                </ul>
            </MDBox>

        );
    };

    const addTodo = async () => {
        try {
            const newTodoObject = {
                name: newTodo,
                is_completed: false
            };
            // Make the API call to post the new todo
            const response = await service.makeAPICall({
                methodName: service.Methods.POST,
                apiUrl: service.API_URL.todo.postToDo,
                body: newTodoObject,
            });

            // Update the state with the newly added todo directly from response data
            setTodos(prevTodos => [...prevTodos, response?.data?.data])
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id: number) => {
        try {
            const updatedTodo = todos.find((todo) => todo.id === id);
            if (updatedTodo) {
                updatedTodo.completed = !updatedTodo.completed;
                const bodyToSend = {
                    is_completed: updatedTodo.completed
                }
                await service.makeAPICall({
                    methodName: service.Methods.PUT,
                    apiUrl: service.API_URL.todo.updateToDo,
                    body: bodyToSend,
                    params: id
                });
                setTodos(prevTodos => [...prevTodos.filter((todo) => todo.id !== id), updatedTodo]);
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Card sx={{ maxWidth: 900, margin: 'auto', padding: '20px' }}>
                <MDBox mb={2} sx={{ display: 'flex', alignItems: 'center' }} className='action_wrap'>
                    <MDInput
                        type="text"
                        placeholder="Enter new todo"
                        {...register("newTodo", { required: true })}
                        value={newTodo}
                        fullWidth
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
                    />
                    <MDButton className='flex_auto action-button' variant="gradient" color="info" sx={{ marginLeft: 2, paddingY: 1, paddingX: 2 }} onClick={handleSubmit(addTodo)} children={<Add />} />
                </MDBox>
                {errors.newTodo && <ErrorShow error="New Todo is required" />}

                <MDBox mt={2}>
                    {renderTodos(todos)}
                </MDBox>
                <Confirm message={globalMessages.toDo.delete} method={service.Methods.DELETE} url={service.API_URL.todo.deleteToDo} visible={deleteOpen} closeModal={handleToggleDelete} id={deleteId} />
            </Card>
        </DashboardLayout>
    );
};

export default ToDo;

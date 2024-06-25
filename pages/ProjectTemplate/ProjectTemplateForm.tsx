import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { service } from "utils/Service/service";
import { Card, Grid, Switch } from '@mui/material';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import MDBox from 'components/MDBox';
import MDInput from 'components/MDInput';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDTypography from 'components/MDTypography';
import globalMessages from 'utils/global';
import { useForm } from 'react-hook-form';
import ErrorShow from 'common/ErrorShow';
import Select from 'components/MDSelect';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { minutesToTime, timeNumber, timeToMinutes } from 'utils/common';
import { addData } from "../../redux/features/commonData/commonData";
import { useDispatch } from 'react-redux';



interface ProjectTemplateFormProps {
    method: string;
}

interface Task {
    project_template_task_id: number;
    task_title: string;
    task_time: string;
}

interface WorkPackage {
    project_template_work_package_id: number;
    work_package_title: string;
    work_package_time: string;
    tasks: Task[];
}

interface TemplateData {
    project_template_id: number;
    template_name: string;
    work_type: number;
    is_active: boolean;
    work_package: WorkPackage[];
}

const ProjectTemplateForm: React.FC<ProjectTemplateFormProps> = ({ method }) => {
    const [controller, dispatch] = useMaterialUIController();
    const { sidenavColor } = controller;
    const dispatchData = useDispatch();
    const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, unregister, watch } = useForm<TemplateData>();
    const history = useNavigate();
    const { id } = useParams();
    const [workPackages, setWorkPackages] = useState([{ id: 1, tasks: [{ id: Date.now() }] }]);
    const [workTypeOptions, setWorkTypeOptions] = useState<any[]>([]);
    const [workPackageRef, setWorkPackageRef] = useState<number>(0);


    const fetchWorkType = async () => {
        try {
            const response = await service.makeAPICall({
                methodName: service.Methods.GET,
                apiUrl: service.API_URL.workType.list,
            });
            setWorkTypeOptions(() => {
                return response?.data.data?.map((workType: any) => {
                    return { value: workType.work_type_id, label: workType.name };
                });
            });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchWorkType();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await service.makeAPICall({
                    methodName: service.Methods.GET,
                    apiUrl: service.API_URL.projectTemplate.get,
                    params: id,
                });
                // set default values of react hook form
                const templateData: TemplateData = response?.data.data;

                const newWorkPackages = templateData.work_package?.map((wp) => ({
                    id: wp.project_template_work_package_id,
                    project_template_work_package_id: wp.project_template_work_package_id,
                    work_package_title: wp.work_package_title,
                    work_package_time: wp.work_package_time,
                    tasks: wp.tasks?.map((task) => ({
                        id: task.project_template_task_id,
                        project_template_task_id: task.project_template_task_id,
                        task_title: task.task_title,
                        task_time: task.task_time,
                    })),
                }));
                setWorkPackages(newWorkPackages);

                // Set form values using setValue
                setValue('project_template_id', templateData.project_template_id);
                setValue('template_name', templateData.template_name);
                setValue('work_type', templateData.work_type);
                setValue('is_active', templateData.is_active);

                newWorkPackages.forEach((wp, index) => {
                    setValue(`work_package.${wp.id}.project_template_work_package_id`, wp.project_template_work_package_id);
                    setValue(`work_package.${wp.id}.work_package_title`, wp.work_package_title);
                    setValue(`work_package.${wp.id}.work_package_time`, minutesToTime(parseInt(wp.work_package_time)));

                    wp.tasks.forEach((task, taskIndex) => {
                        setValue(`work_package.${wp.id}.tasks.${task.id}.project_template_task_id`, task.project_template_task_id);
                        setValue(`work_package.${wp.id}.tasks.${task.id}.task_title`, task.task_title);
                        setValue(`work_package.${wp.id}.tasks.${task.id}.task_time`, minutesToTime(parseInt(task.task_time)));
                    });
                });
                trigger();
            } catch (error) {
                console.log(error);
            }
        };

        if (id && method === 'PUT') {
            fetchData();
        }
    }, [id, method, setValue]);




    const onSubmit = async (templateData: TemplateData) => {
        try {
            // Filter out work packages with empty titles
            const filteredWorkPackages = Object.values(templateData.work_package)
                .filter((wp) => wp.work_package_title.trim() !== '')
                ?.map((wp: any) => {
                    // Filter out tasks with empty titles
                    const filteredTasks = Object.values(wp.tasks)
                        .filter((task: any) => task.task_title.trim() !== '')
                        ?.map((task: any) => ({
                            task_title: task.task_title,
                            task_time: timeToMinutes(task.task_time), // Convert to number
                            project_template_task_id: task.project_template_task_id,
                        }));

                    return {
                        ...wp,
                        work_package_time: timeToMinutes(wp.work_package_time), // Convert to number
                        project_template_work_package_id: wp.project_template_work_package_id,
                        tasks: filteredTasks,
                    };
                });

            const formattedData = {
                ...templateData,
                project_template_id: templateData.project_template_id,
                work_package: filteredWorkPackages,
            };

            const apiMethod = method === 'POST' ? service.Methods.POST : service.Methods.PUT;
            const url = method === 'POST' ? service.API_URL.projectTemplate.create : service.API_URL.projectTemplate.update;
            await service.makeAPICall({
                methodName: apiMethod,
                apiUrl: url,
                body: formattedData,
            });
            await dispatchData(addData({ key: "project_template_tab_value", data: 0 }));
            history(-1);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCopyWorkPackage = async () => {
        const workPackageId = workPackageRef;
        const originalWorkPackage = workPackages.find((wp) => wp.id === workPackageId);

        if (originalWorkPackage) {
            let newId = Date.now();
            const newTasks = originalWorkPackage.tasks?.map((task: any) => {
                return {
                    id: newId++,
                    task_title: getValues(`work_package.${workPackageId}.tasks.${task.id}.task_title`),
                    task_time: getValues(`work_package.${workPackageId}.tasks.${task.id}.task_time`),
                }
            })
            setWorkPackages((prevWorkPackages) => [
                ...prevWorkPackages,
                { id: newId, tasks: newTasks },
            ]);
            // set values in duplicate work package
            setValue(`work_package.${newId}.work_package_title`, getValues(`work_package.${workPackageId}.work_package_title`));
            setValue(`work_package.${newId}.work_package_time`, getValues(`work_package.${workPackageId}.work_package_time`));

            newTasks.forEach((task) => {
                setValue(`work_package.${newId}.tasks.${task.id}.task_title`, task.task_title);
                setValue(`work_package.${newId}.tasks.${task.id}.task_time`, task.task_time);
            });
        }
    };



    const handleAddWorkPackage = () => {
        setWorkPackages((prevWorkPackages) => [
            ...prevWorkPackages,
            { id: Date.now(), tasks: [{ id: Date.now() }] },
        ]);
    };

    const handleAddtasks = (workPackageId: number) => {
        setWorkPackages((prevWorkPackages) =>
            prevWorkPackages?.map((wp) => wp.id === workPackageId ? { ...wp, tasks: [...wp.tasks, { id: Date.now() }] } : wp)
        );
    };

    const handleRemoveWorkPackage = (workPackageId: number) => {
        setWorkPackages((prevWorkPackages) =>
            prevWorkPackages.filter((wp) => wp.id !== workPackageId)
        );

        // Clear form values for the removed work package
        setValue(`work_package.${workPackageId}.work_package_title`, '');

        // Clear form values for tasks in the removed work package
        workPackages
            .find((wp) => wp.id === workPackageId)
            ?.tasks.forEach((task) => {
                setValue(`work_package.${workPackageId}.tasks.${task.id}.task_title`, '');
            });
    };

    const handleRemoveTask = (workPackageId: number, taskId: number) => {
        setWorkPackages((prevWorkPackages) =>
            prevWorkPackages?.map((wp) =>
                wp.id === workPackageId ? { ...wp, tasks: wp.tasks.filter((task) => task.id !== taskId), } : wp
            )
        );

        // Clear form values for tasks
        setValue(`work_package.${workPackageId}.tasks.${taskId}.task_title`, '');
        unregister(`work_package.${workPackageId}.tasks.${taskId}.task_time`)
        handleWpTimeSet(workPackageId)
    };

    const handleFocusWorkPackage = (workPackageId: number) => {
        setWorkPackageRef(workPackageId);
    };

    const handleWorkTypeChange = (selectedOption: any) => {
        setValue('work_type', selectedOption.target.value);
        trigger('work_type');
    };

    const handleToggle = () => {
        setValue('is_active', !getValues('is_active'))
        trigger('is_active');
    }

    const handleWpTimeSet = (workPackageId: number) => {
        const totalTaskTime = Object.values(getValues(`work_package.${workPackageId}.tasks`))
            .reduce((total: number, task: any) => {
                const taskTime = task.task_time ? timeToMinutes(task.task_time) : 0;
                return total + taskTime;
            }, 0);
        setValue(`work_package.${workPackageId}.work_package_time`, minutesToTime(totalTaskTime));
        trigger(`work_package.${workPackageId}.work_package_time`);
    }



    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={4} pb={3}>
                    <Grid container spacing={1}>
                        <Grid item xs={15} className='module_wrap'>
                            <MDBox mx={2} my={3} mt={-3} py={2} px={2} variant="gradient" bgColor={sidenavColor} borderRadius="lg" coloredShadow="info" className='module_head'>
                                <MDTypography variant="h6" color="white">
                                    {method === 'POST' ? 'Add' : 'Update'} {globalMessages.project_template.title}
                                </MDTypography>
                            </MDBox>
                            <MDBox component="form" role="form">
                                <MDBox pt={6} pb={3}>

                                    <MDBox ml={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={8} md={3} lg={4}>
                                                <MDBox mb={3} ml={3} >
                                                    <MDInput type="text" {...register("template_name", { required: 'Title is requird' })} InputLabelProps={id && getValues('template_name') && { shrink: watch('template_name') ? true : false }} label={globalMessages.project_template.template_title} fullWidth required />
                                                    {errors.template_name?.message && <ErrorShow error={errors.template_name?.message} />}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={8} md={3} lg={4}>
                                                <MDBox fontSize='medium' mb={3} ml={3} >
                                                    <Select
                                                        value={getValues('work_type') ? String(getValues('work_type')) : ''}
                                                        {...register("work_type", { required: 'Work type is requird' })}
                                                        placeholder={globalMessages.project_template.select_work_type}
                                                        options={workTypeOptions}
                                                        handleChange={handleWorkTypeChange}
                                                    />
                                                    {errors.work_type?.message && <ErrorShow error={errors.work_type?.message} />}
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={8} md={3} lg={4}>
                                                <MDBox mb={3} ml={3} >
                                                    <MDTypography variant="button" fontSize={'0.8em'} fontWeight="regular" color="text" sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}>
                                                        {globalMessages.project_template.is_active}
                                                    </MDTypography>
                                                    <Switch checked={getValues('is_active')} {...register("is_active")} onClick={handleToggle} />
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox>
                                        {workPackages?.map((workPackage) => (
                                            <MDBox mb={5} >
                                                <Card key={workPackage.id} onFocus={() => handleFocusWorkPackage(workPackage.id)} >
                                                    <Grid container spacing={1} mt={0} ml={1} mb={0} justifyContent="flex-end">
                                                        {workPackages.length > 1 && (
                                                            <Grid item xs={8} md={3} lg={1}>
                                                                <MDButton onClick={() => handleRemoveWorkPackage(workPackage.id)} variant="contained" color="error">
                                                                    <DeleteOutlineIcon />
                                                                </MDButton>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                    <Grid container spacing={3} mt={0} ml={3} mb={3}>
                                                        <Grid item xs={8} md={3} lg={3}>
                                                            <MDInput
                                                                {...register(`work_package.${workPackage.id}.work_package_title`, { required: 'Title is requird' })}
                                                                type="text"
                                                                InputLabelProps={id && getValues(`work_package.${workPackage.id}.work_package_title`) && { shrink: watch(`work_package.${workPackage.id}.work_package_title`) ? true : false }}
                                                                label={globalMessages.project_template.work_package_title}

                                                                fullWidth required />
                                                            {errors?.work_package?.[workPackage.id]?.work_package_title?.message && (
                                                                <ErrorShow
                                                                    error={
                                                                        errors.work_package?.[workPackage.id]?.work_package_title?.message || ''
                                                                    }
                                                                />
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={8} md={3} lg={3}>
                                                            <MDInput
                                                                {...register(`work_package.${workPackage.id}.work_package_time`, {
                                                                    required: 'Estimate time is requird',
                                                                    pattern: timeNumber,
                                                                })}
                                                                type="text"
                                                                placeholder={"HH:MM"}
                                                                InputLabelProps={id && getValues(`work_package.${workPackage.id}.work_package_time`) && { shrink: watch(`work_package.${workPackage.id}.work_package_time`) ? true : false }}
                                                                label={globalMessages.project_template.work_package_time}
                                                                fullWidth required />
                                                            {errors?.work_package?.[workPackage.id]?.work_package_time?.message && (
                                                                <ErrorShow
                                                                    error={
                                                                        errors.work_package?.[workPackage.id]?.work_package_time?.message || ''
                                                                    }
                                                                />
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={8} md={3} lg={3}>
                                                            <MDButton onClick={() => handleAddtasks(workPackage.id)} variant="contained" color="dark">
                                                                <AddCircleIcon />
                                                            </MDButton>
                                                        </Grid>
                                                    </Grid>

                                                    {workPackage.tasks?.map((tasks) => (
                                                        <Grid container spacing={3} key={tasks.id} ml={3}>
                                                            <Grid item xs={8} md={6} lg={5}>
                                                                <MDBox mb={3}>
                                                                    <MDInput
                                                                        {...register(`work_package.${workPackage.id}.tasks.${tasks.id}.task_title`, { required: 'Title is requird' })}
                                                                        type="text"
                                                                        InputLabelProps={id && getValues(`work_package.${workPackage.id}.tasks.${tasks.id}.task_title`) && { shrink: watch(`work_package.${workPackage.id}.tasks.${tasks.id}.task_title`) ? true : false }}
                                                                        label={globalMessages.project_template.task_title}
                                                                        fullWidth required />
                                                                    {errors?.work_package?.[workPackage.id]?.tasks?.[tasks.id]?.task_title?.message && (
                                                                        <ErrorShow
                                                                            error={
                                                                                errors.work_package?.[workPackage.id]?.tasks?.[tasks.id]?.task_title?.message || ''
                                                                            }
                                                                        />
                                                                    )}
                                                                </MDBox>
                                                            </Grid>
                                                            <Grid item xs={8} md={6} lg={4}>
                                                                <MDBox mb={3}>
                                                                    <MDInput
                                                                        {...register(`work_package.${workPackage.id}.tasks.${tasks.id}.task_time`, {
                                                                            required: 'Estimate time is requird',
                                                                            pattern: timeNumber,
                                                                            onChange: () => handleWpTimeSet(workPackage.id)
                                                                        })}
                                                                        type="text"
                                                                        placeholder={"HH:MM"}
                                                                        InputLabelProps={id && getValues(`work_package.${workPackage.id}.tasks.${tasks.id}.task_time`) && { shrink: watch(`work_package.${workPackage.id}.tasks.${tasks.id}.task_time`) ? true : false }}
                                                                        label={globalMessages.project_template.task_time}
                                                                        fullWidth required />
                                                                    {errors?.work_package?.[workPackage.id]?.tasks?.[tasks.id]?.task_time?.message && (
                                                                        <ErrorShow
                                                                            error={
                                                                                errors.work_package?.[workPackage.id]?.tasks?.[tasks.id]?.task_time?.message || ''
                                                                            }
                                                                        />
                                                                    )}
                                                                </MDBox>
                                                            </Grid>
                                                            {workPackage.tasks.length > 1 && (
                                                                <Grid item xs={8} md={3} lg={3}>
                                                                    <MDButton onClick={() => handleRemoveTask(workPackage.id, tasks.id)} variant="contained" color="dark">
                                                                        <RemoveCircleOutlineIcon />
                                                                    </MDButton>
                                                                </Grid>
                                                            )}
                                                        </Grid>

                                                    ))}
                                                </Card>

                                            </MDBox>
                                        ))}
                                    </MDBox>
                                    <MDBox ml={3} mt={2} mb={3} display="flex"
                                        justifyContent="flex-end"
                                        alignItems="center" >
                                        <MDBox mr={2} className='action_wrap'>
                                            <MDButton className='action-button' mr={20} onClick={handleAddWorkPackage} variant="contained" color="info" >
                                                {globalMessages.project_template.add_wp}
                                            </MDButton>
                                        </MDBox>
                                        <MDBox>
                                            <MDButton ml={10} onClick={handleCopyWorkPackage} variant="contained" color="secondary" >
                                                {globalMessages.project_template.copy_wp}
                                            </MDButton>
                                        </MDBox>
                                    </MDBox>
                                    <MDBox className='action_wrap d_flex'>
                                        <MDButton className='action-button' variant="gradient" color={sidenavColor} sx={{ mr: 2 }} onClick={handleSubmit(onSubmit)}>
                                            {method === 'POST' ? 'Add' : 'Update'} {globalMessages.project_template.save_button_text}
                                        </MDButton>
                                        <MDButton variant="gradient" color="error" onClick={() => {
                                            dispatchData(addData({ key: "project_template_tab_value", data: 0 }));
                                            history(-1)
                                        }}>
                                            {globalMessages.project_template.cancel_button_text}
                                        </MDButton>
                                    </MDBox>


                                </MDBox >

                            </MDBox>
                        </Grid>
                    </Grid>
                </MDBox>
            </DashboardLayout >
        </>
    );
};

export default ProjectTemplateForm;

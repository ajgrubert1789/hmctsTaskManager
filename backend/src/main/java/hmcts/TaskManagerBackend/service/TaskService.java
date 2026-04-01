package hmcts.TaskManagerBackend.service;

// Importing required classes


import hmcts.TaskManagerBackend.entity.Task;

import java.util.List;

// Interface
public interface TaskService {

    // Save operation
    Task saveTask(Task task);

    //
    Task getTaskById(Long taskId);

    // Read operation
    List<Task> fetchTaskList();


    // Update operation
    Task updateTask(Task task,
                                Long taskId);

    // Delete operation
    void deleteTaskById(Long taskId);
}
package hmcts.TaskManagerBackend.service;

import java.time.LocalDateTime;
import java.util.List;
import hmcts.TaskManagerBackend.entity.Task;
import hmcts.TaskManagerBackend.exception.TaskNotFoundException;
import hmcts.TaskManagerBackend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class TaskServiceImpl
        implements hmcts.TaskManagerBackend.service.TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Save operation
    @Override
    public Task saveTask(Task task) {
        if (task == null) {
            throw new IllegalArgumentException("Task cannot be null");
        }
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        if (task.getDescription() == null || task.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }
        if (task.getDueDateTime() == null || task.getDueDateTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Due date must be in the future");
        }

        return taskRepository.save(task);
    }

    @Override
    public Task getTaskById(Long taskId) {
        if (taskId == null) {
            throw new IllegalArgumentException("Task ID cannot be null");
        }

        return taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found"));
    }


    // Read operation
    @Override public List<Task> fetchTaskList()
    {
        return (List<Task>)
                taskRepository.findAll();
    }

    @Override
    public Task updateTask(Task task, Long taskId) {

        // 1. Retrieve the existing record first
        Task taskDB = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found"));

        if (task.getTitle() != null) {
            taskDB.setTitle(task.getTitle());
        }

        if (task.getDescription() != null && !task.getDescription().trim().isEmpty()) {
            taskDB.setDescription(task.getDescription());
        }


        if (task.getStatus() != null) {
            taskDB.setStatus(task.getStatus());
        }

        if (task.getDueDateTime() != null) {
            taskDB.setDueDateTime(task.getDueDateTime());
        }

        if (task.getIsManualOverride() != null) {
            taskDB.setIsManualOverride(task.getIsManualOverride());
        }


        return taskRepository.save(taskDB);
    }

    // Delete operation
    @Override
    public void deleteTaskById(Long taskId)
    {
        if (taskId == null) {
            throw new IllegalArgumentException("Task cannot be null");
        }
        taskRepository.deleteById(taskId);
    }
}
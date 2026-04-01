package hmcts.TaskManagerBackend;
import hmcts.TaskManagerBackend.entity.Task;
import hmcts.TaskManagerBackend.repository.TaskRepository;
import hmcts.TaskManagerBackend.service.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {


    @Mock
    private TaskRepository taskRepository;   // Mocked repository dependency

    @InjectMocks
    private TaskServiceImpl taskService;     // Service under test with mocks injected

    private Task task;                       // Reusable Task object for tests

    @BeforeEach
    void setUp() {                           // Runs before each test
        task = Task.builder()
                .taskId(1L)
                .title("Test Task")
                .description("Testing Description")
                .dueDateTime(LocalDateTime.now().plusDays(1))
                .status(false)
                .build();
    }

    @Test
    @DisplayName("Should successfully save a task")
    void saveTaskTest() {

        Task task = new Task();              // Create new task
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setDueDateTime(LocalDateTime.now().plusDays(1));

        given(taskRepository.save(task)).willReturn(task);   // Mock repository behaviour

        Task savedTask = taskService.saveTask(task);         // Call service method

        assertThat(savedTask).isNotNull();                   // Validate result
        assertThat(savedTask.getTitle()).isEqualTo("Test Task");
        verify(taskRepository, times(1)).save(any(Task.class)); // Ensure save() was called
    }

    @Test
    @DisplayName("Should throw exception when saving a null task")
    void saveNullTaskTest() {

        assertThatThrownBy(() -> taskService.saveTask(null)) // Expect exception
                .isInstanceOf(IllegalArgumentException.class);

        verify(taskRepository, never()).save(any());         // Ensure repo not called
    }

    @Test
    @DisplayName("Should handle database connection failure")
    void saveTaskRepoErrorTest() {
        Task task = new Task();
        task.setTitle("Valid Title");
        task.setDescription("Valid Description");
        task.setDueDateTime(LocalDateTime.now().plusDays(1));

        given(taskRepository.save(any())).willThrow(new RuntimeException("DB Down")); // Simulate DB failure

        assertThatThrownBy(() -> taskService.saveTask(task)) // Expect runtime exception
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("DB Down");
    }

    @Test
    @DisplayName("Should throw exception when title is empty")
    void saveTask_EmptyTitle_ThrowsException() {

        task.setTitle("");                                   // Invalid title

        assertThatThrownBy(() -> taskService.saveTask(task)) // Expect validation failure
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Should return task by ID")
    void getTaskByIdTest() {
        given(taskRepository.findById(1L)).willReturn(Optional.of(task)); // Mock repo response

        Task foundTask = taskService.getTaskById(1L);        // Call service

        assertThat(foundTask).isNotNull();                   // Validate
        assertThat(foundTask.getTaskId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("Should update task successfully")
    void updateTaskTest() {
        Task existingTask = Task.builder().taskId(1L).title("Old").status(false).build();
        Task updatedInfo = Task.builder().title("New Title").description("New Desc").status(true).build();

        given(taskRepository.findById(1L)).willReturn(Optional.of(existingTask)); // Mock find
        given(taskRepository.save(any(Task.class))).willReturn(existingTask);     // Mock save

        Task result = taskService.updateTask(updatedInfo, 1L); // Perform update

        assertThat(result.getTitle()).isEqualTo("New Title");  // Validate updated fields
        assertThat(result.getStatus()).isTrue();
        verify(taskRepository).save(existingTask);             // Ensure save called
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent task")
    void updateTask_NotFound_ThrowsException() {

        Long taskId = 99L;
        Task updateInfo = Task.builder()
                .title("New")
                .description("Valid Description")
                .dueDateTime(LocalDateTime.now().plusDays(1))
                .build();

        given(taskRepository.findById(taskId)).willReturn(Optional.empty()); // Simulate missing task

        assertThatThrownBy(() -> taskService.updateTask(updateInfo, taskId)) // Expect exception
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    @DisplayName("Should successfully update all fields at once")
    void updateTask_AllFields_Success() {
        Long taskId = 1L;
        Task existing = Task.builder().taskId(taskId).title("Old").status(false).build();

        LocalDateTime newDate = LocalDateTime.now().plusDays(10);

        Task updateInfo = Task.builder()
                .title("New Title")
                .description("New Description")
                .status(true)
                .dueDateTime(newDate)
                .build();

        given(taskRepository.findById(taskId)).willReturn(Optional.of(existing));
        given(taskRepository.save(any())).willAnswer(inv -> inv.getArgument(0)); // Return updated object

        Task result = taskService.updateTask(updateInfo, taskId);

        assertThat(result.getTitle()).isEqualTo("New Title");
        assertThat(result.getDescription()).isEqualTo("New Description");
        assertThat(result.getStatus()).isTrue();
        assertThat(result.getDueDateTime()).isEqualTo(newDate);
    }

    @Test
    @DisplayName("Should only update permitted fields")
    void updateTask_PartialUpdate_PreservesIdentity() {
        Long taskId = 1L;
        Task existingTask = Task.builder().taskId(taskId).title("Old").build();
        Task updateInfo = Task.builder().title("New Title").build();

        given(taskRepository.findById(taskId)).willReturn(Optional.of(existingTask));
        given(taskRepository.save(any())).willAnswer(invocation -> invocation.getArgument(0));

        Task result = taskService.updateTask(updateInfo, taskId);

        assertThat(result.getTaskId()).isEqualTo(taskId); // ID unchanged
        assertThat(result.getTitle()).isEqualTo("New Title");
    }

    @Test
    @DisplayName("Should preserve existing due date when update info has null date")
    void updateTask_NullDate_DoesNotOverwrite() {
        LocalDateTime originalDate = LocalDateTime.now().plusDays(5);
        Task existingTask = Task.builder()
                .taskId(1L)
                .dueDateTime(originalDate)
                .title("Original Title")
                .build();

        Task updateInfo = Task.builder()
                .title("Updated Title")
                .dueDateTime(null) // Null date should not overwrite
                .build();

        given(taskRepository.findById(1L)).willReturn(Optional.of(existingTask));
        given(taskRepository.save(any())).willAnswer(inv -> inv.getArgument(0));

        Task result = taskService.updateTask(updateInfo, 1L);

        assertThat(result.getTitle()).isEqualTo("Updated Title");
        assertThat(result.getDueDateTime()).isEqualTo(originalDate); // Date preserved
    }

    @Test
    @DisplayName("Should delete task by ID")
    void deleteTaskByIdTest() {
        Long taskId = 1L;
        willDoNothing().given(taskRepository).deleteById(taskId); // Mock void method

        taskService.deleteTaskById(taskId);

        verify(taskRepository, times(1)).deleteById(taskId); // Ensure delete called
    }

    @Test
    @DisplayName("Should propagate exception when task ID does not exist")
    void deleteTaskById_DoesNotExist_ThrowsException() {
        Long taskId = 999L;

        doThrow(new org.springframework.dao.EmptyResultDataAccessException(1))
                .when(taskRepository).deleteById(taskId); // Simulate missing ID

        assertThatThrownBy(() -> taskService.deleteTaskById(taskId))
                .isInstanceOf(org.springframework.dao.DataAccessException.class);
    }

}
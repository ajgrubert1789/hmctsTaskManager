package hmcts.TaskManagerBackend.repository;

import hmcts.TaskManagerBackend.entity.Task;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TaskRepository
        extends CrudRepository<Task, Long> {
} 
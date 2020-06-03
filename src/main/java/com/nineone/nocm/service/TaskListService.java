package com.nineone.nocm.service;

import java.util.List;
import java.util.Map;

import com.nineone.nocm.domain.TaskList;

public interface TaskListService {
	boolean insertTaskList(TaskList taskList);
	boolean deleteTaskList(TaskList taskList);
	boolean updateTaskListName(TaskList taskList);
	List<TaskList> getTaskList(int channel_id);
	boolean updateTaskListPosition(Map<String,Object> map);
}

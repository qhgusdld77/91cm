package com.nineone.nocm.controller.api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.nineone.nocm.domain.Task;
import com.nineone.nocm.service.TaskService;

@RestController
@RequestMapping("/api/task")
public class TaskController {

	@Autowired
	private TaskService taskService;

	@RequestMapping(value="/insert",method = RequestMethod.POST)
	public Task insertTask(@RequestBody Task task) {
		if(taskService.insertTask(task)){
			return task;
		}
		return null;
	}

	@RequestMapping(value="/delete",method = RequestMethod.POST)
	public boolean deleteTask(@RequestBody Task task) {
		return taskService.deleteTask(task);
	}

	@RequestMapping(value="/update/content",method = RequestMethod.POST)
	public boolean updateTaskContent(@RequestBody Task task) {
		return taskService.updateTaskContent(task);
	}

	@RequestMapping(value="/update/position",method=RequestMethod.POST)
	public boolean updateTaskPosition(@RequestBody Map<String,Object> map) {
		// 한 리스트안에서만 task 이동이 있을 때는 위치 변경 전 task의 index값과 변경 후 task의 index값 , task가 속한 list의 id값,해당 task의 id값 이 필요
		// taskOldIndex, taskNewIndex, tasklistId, taskId
		// 특정 리스트 안에 있던 task를 다른 리스트로 이동시킬 때는  위치 변경 전 task의 index값과 리스트의 id값, 위치변경 후 task의 index값과 리스트의 id값, 해당 task의 id
		// taskOldIndex, taskNewIndex, tasklistOldId, tasklistNewId, taskId
		return taskService.updateTaskPosition(map);
	}
}
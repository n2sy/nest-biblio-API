import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { addTaskDTO } from './DTO/addTaskDTO';
import { TaskService } from './task.service';
import { ApiTags } from '@nestjs/swagger';
import { UpperandfusionPipe } from '../upperandfusion/upperandfusion.pipe';

@ApiTags('Tâches')
@Controller('task')
export class TaskController {
  //constructor(private taskSer: TaskService) {}

  @Inject(TaskService) private taskSer;

  @Get('all')
  getAllTasks() {
    let tab = this.taskSer.chercherTousLesTasks();
    return { result: tab };
  }

  @Post('new')
  AddNewTask(@Body() body: addTaskDTO) {
    this.taskSer.ajouterTask(body);
    return { message: 'task ajouté', tasksPLB: this.taskSer.allTasks };
  }

  @Get('search/:id')
  getOneTask(@Param('id') taskId) {
    let task = this.taskSer.chercherTaskParId(taskId);
    return { searchedTask: task };
  }

  @Get('filter')
  filterTasks(@Query('year1') y1, @Query('year2') y2) {
    let filtredTasks = this.taskSer.chercherTasksParAnnees(y1, y2);
    return { result: filtredTasks };
  }

  @Put('edit/:id')
  updateTask(@Body() body, @Param('id') taskId) {
    this.taskSer.modifierTask(taskId, body);
    return { message: 'task modifié avec succès', id: taskId };
  }

  @Delete('delete/:taskid')
  deleteTask(@Param('taskid') taskId) {
    this.taskSer.supprimerTask(taskId);
    return {
      message: 'Task supprimé avec succès',
      id: taskId,
    };
  }

  @Get('testpipe')
  testerPipe(@Body('tab', UpperandfusionPipe) tab) {
    return { result: tab };
  }
}

// function test(a, b) {
//   return a + b;
// }

//  (a, b) => {
//     return a + b;
// }

//  (a, b) =>  a + b;

//  a =>  a + 10;

//  () =>  20 + 10;

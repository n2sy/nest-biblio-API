import { Injectable, NotFoundException } from '@nestjs/common';
import { addTaskDTO } from './DTO/addTaskDTO';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './models/task';

@Injectable()
export class TaskService {
  allTasks = [];

  chercherTousLesTasks() {
    return this.allTasks;
  }

  chercherTaskParId(taskId) {
    let selectedTask = this.allTasks.find((t) => t.id == taskId);
    if (!selectedTask) {
      // if(selectedTask == undefined || null)
      throw new NotFoundException("Le task demandé n'existe pas");
    }

    return selectedTask;
  }

  chercherTasksParAnnees(annee1, annee2) {
    return this.allTasks.filter((t) => t.year >= annee1 && t.year <= annee2);
  }

  modifierTask(taskId, body) {
    let indice = this.allTasks.findIndex((t) => t.id == taskId);
    if (indice == -1) {
      // if(selectedTask == undefined || null)
      throw new NotFoundException(
        "Le task que vous souhaitez mettre à jour n'existe pas",
      );
    }

    this.allTasks[indice] = {
      id: taskId,
      title: body.title,
      year: body.year,
      statut: body.statut,
      createdAt: this.allTasks[indice].createdAt,
    };
  }

  supprimerTask(taskId) {
    let indice = this.allTasks.findIndex((t) => t.id == taskId);
    if (indice == -1) {
      // if(selectedTask == undefined || null)
      throw new NotFoundException(
        "Le task que vous souhaitez mettre à jour n'existe pas",
      );
    }
    //let abc = 10;
    this.allTasks.splice(indice, 1);
  }

  ajouterTask(bodyTask: addTaskDTO) {
    let generatedId = uuidv4();
    let newTask = new Task(
      generatedId,
      bodyTask.title,
      bodyTask.year,
      bodyTask.statut,
    );

    this.allTasks.push(newTask);
  }
}

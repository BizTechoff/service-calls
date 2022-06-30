import { Component, OnInit } from '@angular/core';
import { GridSettings } from '@remult/angular/interfaces';
import { Remult } from 'remult';
import { Project } from '../project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects!: GridSettings<Project>
  constructor(private remult: Remult) { }

  async ngOnInit() {
    await this.initGrid()
  }

  async initGrid() {
    this.projects = new GridSettings<Project>(this.remult.repo(Project), {
      rowButtons: [
        {
          click: async (row) => this.openBuildingManagers(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openBuildings(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openComplexes(row.id),
          showInLine: true
        }
      ]
    })
  }

  async openBuildingManagers(pid = '') {

  }

  async openBuildings(pid = '') {

  }

  async openComplexes(pid = '') {

  }

}

import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { Project } from '../project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects!: GridSettings<Project>
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };

  @DataControl<ProjectsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש פרוייקט' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.projects.reloadData()
  }

  async initGrid() {
    this.projects = new GridSettings<Project>(this.remult.repo(Project), {
      rowButtons: [
        {
          click: async (row) => this.openBuildingManagers(row.id),
          showInLine: true,
          textInMenu: 'מנהלי עבודה משוייכים'
        },
        {
          click: async (row) => this.openBuildings(row.id),
          showInLine: true,
          textInMenu: 'בניינים משוייכים'
        },
        {
          click: async (row) => this.openComplexes(row.id),
          showInLine: true,
          textInMenu: 'מתחמים משוייכים'
        }
      ]
    })
  }

  async upsertProject(pid = '') {
    if (!pid) pid = ''
    let p!: Project
    if (pid.length) {
      p = await this.remult.repo(Project).findId(pid)
      if (!p) throw `Project-Id '${pid}' NOT EXISTS`
    }
    else {
      p = this.remult.repo(Project).create()
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: 'פרוייקט חדש',
        ok: async () => { await p.save() },
        fields: () => [
          p.$.name,
          p.$.address]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openBuildingManagers(pid = '') {

  }

  async openBuildings(pid = '') {

  }

  async openComplexes(pid = '') {

  }

}

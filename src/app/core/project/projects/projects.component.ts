import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { ApartmentsComponent } from '../../apartment/apartments/apartments.component';
import { BuildingsComponent } from '../../building/buildings/buildings.component';
import { ComplexesComponent } from '../../complex/complexes/complexes.component';
import { ConstructionContractorsComponent } from '../../construction-contractor/construction-contractors/construction-contractors.component';
import { RequestsComponent } from '../../request/requests/requests.component';
import { TenantsComponent } from '../../tenant/tenants/tenants.component';
import { Project } from '../project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  args: {
    pid?: string,
    cid?: string,
    bid?: string,
    aid?: string
  } = { pid: '', cid: '', bid: '', aid: '' }
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
      where: this.args.pid?.length ? { id: this.args.pid } : undefined,
      gridButtons: [{
        icon: 'refresh',
        textInMenu: () => 'רענן',
        click: async () => await this.refresh()
      }],
      rowButtons: [
        {//border_outer: project
          click: async (row) => this.openBuildingManagers(row.id),
          showInLine: true,
          textInMenu: 'מנהלי עבודה',
          icon: 'engineering'
        },
        {
          click: async (row) => this.openComplexes(row.id),
          showInLine: true,
          textInMenu: 'מתחמים',
          icon: 'workspaces'
        },
        {
          click: async (row) => this.openBuildings(row.id),
          showInLine: true,
          textInMenu: 'בניינים',
          icon: 'location_city'
        },
        {
          click: async (row) => this.openApartments(row.id),
          showInLine: true,
          textInMenu: 'דירות',
          icon: 'house'
        },
        {
          click: async (row) => this.openTenants(row.id),
          showInLine: true,
          textInMenu: 'דיירים',
          icon: 'groups'
        },
        {
          click: async (row) => this.openRequests(row.id),
          showInLine: true,
          textInMenu: 'פניות',
          icon: 'construction'
        },
        {
          click: async (row) => this.upsertProject(row.id),
          showInLine: true,
          textInMenu: 'פרטי פרויקט',
          icon: 'edit'
        }
      ]
    })
  }

  async upsertProject(pid = '') {
    if (!pid) pid = ''
    let p!: Project
    let title = ''
    if (pid.length) {
      p = await this.remult.repo(Project).findId(pid, { useCache: false })
      if (!p) throw `Project-Id '${pid}' NOT EXISTS`
      title = `עדכון פרויקט ${p.idNumber}`
    }
    else {
      p = this.remult.repo(Project).create()
      title = 'הוספת פרוייקט חדש'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await p.save() },
        fields: () => [
          p.$.name,
          p.$.address,
          p.$.idNumber]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openBuildingManagers(pid = '') {
    await openDialog(ConstructionContractorsComponent,
      ref => ref.args = {
        pid: pid
      })
  }

  async openBuildings(pid = '') {
    await openDialog(BuildingsComponent,
      ref => ref.args = {
        pid: pid
      })
  }

  async openComplexes(pid = '') {
    await openDialog(ComplexesComponent,
      ref => ref.args = {
        pid: pid
      })
  }

  async openApartments(pid = '') {
    const changed = await openDialog(ApartmentsComponent,
      ref => ref.args = {
        pid: pid
      })
  }

  async openTenants(pid = '') {
    await openDialog(TenantsComponent,
      ref => ref.args = {
        pid: pid
      })
  }

  async openRequests(pid = '') {
    await openDialog(RequestsComponent,
      ref => ref.args = {
        pid: pid
      })
  }

}

import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { User } from '../../../users/user';
import { ApartmentsComponent } from '../../apartment/apartments/apartments.component';
import { BuildingsComponent } from '../../building/buildings/buildings.component';
import { ComplexesComponent } from '../../complex/complexes/complexes.component';
import { ConstructionContractorsComponent } from '../../construction-contractor/construction-contractors/construction-contractors.component';
import { RequestsComponent } from '../../request/requests/requests.component';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {

  args: {
    pid?: string,
    cid?: string,
    bid?: string,
    aid?: string,
    tid?: string
  } = { pid: '', cid: '', bid: '', aid: '' }
  tenants!: GridSettings<User>
  constructor(private remult: Remult) { }

  get $() { return getFields(this, this.remult) };

  @DataControl<TenantsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש דייר' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.tenants.reloadData()
  }

  async initGrid() {
    this.tenants = new GridSettings<User>(this.remult.repo(User), {
      where: { tenant: true },
      numOfColumnsInGrid: 10,
      columnSettings: (row) => [
        { field: row.name, caption: 'שם דייר' },
        row.mobile,
        row.email
      ],
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
          click: async (row) => this.upsertTenant(row.id),
          showInLine: true,
          textInMenu: 'פרטי דייר',
          icon: 'edit'
        }
      ]
    })
  }

  async upsertTenant(tid = '') {
    if (!tid) tid = ''
    let t!: User
    let title = ''
    if (tid.length) {
      t = await this.remult.repo(User).findId(tid, {useCache : false})
      if (!t) throw `Tenant-Id '${tid}' NOT EXISTS`
      title = `עדכון דייר ${t.name}`
    }
    else {
      t = this.remult.repo(User).create()
      t.tenant = true
      title = 'הוספת דייר חדש'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await t.save() },
        fields: () => [
          t.$.name,
          t.$.mobile,
          t.$.email]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }
  

  async openBuildingManagers(tid = '') {
    await openDialog(ConstructionContractorsComponent,
      ref => ref.args = {
        tid: tid
      })
  }

  async openBuildings(tid = '') {
    await openDialog(BuildingsComponent,
      ref => ref.args = {
        tid: tid
      })
  }

  async openComplexes(tid = '') {
    await openDialog(ComplexesComponent,
      ref => ref.args = {
        tid: tid
      })
  }

  async openApartments(tid = '') {
    const changed = await openDialog(ApartmentsComponent,
      ref => ref.args = {
        tid: tid
      })
  }

  async openTenants(tid = '') {
    await openDialog(TenantsComponent,
      ref => ref.args = {
        tid: tid
      })
  }

  async openRequests(tid = '') {
    await openDialog(RequestsComponent,
      ref => ref.args = {
        tid: tid
      })
  }

}

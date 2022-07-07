import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { ApartmentsComponent } from '../../apartment/apartments/apartments.component';
import { BuildingsComponent } from '../../building/buildings/buildings.component';
import { ConstructionContractorsComponent } from '../../construction-contractor/construction-contractors/construction-contractors.component';
import { RequestsComponent } from '../../request/requests/requests.component';
import { TenantsComponent } from '../../tenant/tenants/tenants.component';
import { Complex } from '../complex';

@Component({
  selector: 'app-complexes',
  templateUrl: './complexes.component.html',
  styleUrls: ['./complexes.component.scss']
})
export class ComplexesComponent implements OnInit {

  args: {
    pid?: string,
    cid?: string,
    bid?: string,
    aid?: string
  } = { pid: '', cid: '', bid: '', aid: '' }
  complexes!: GridSettings<Complex>
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };

  @DataControl<ComplexesComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש מתחם' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.complexes.reloadData()
  }

  async initGrid() {
    this.complexes = new GridSettings<Complex>(this.remult.repo(Complex), {
      where: { project: this.args.pid?.length ? { $id: this.args.pid } : undefined },
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
          click: async (row) => this.upsertComplex(row.id),
          showInLine: true,
          textInMenu: 'פרטי פרויקט',
          icon: 'edit'
        }
      ]
    })
  }

  async upsertComplex(cid = '') {
    if (!cid) cid = ''
    let c!: Complex
    let title = ''
    if (cid.length) {
      c = await this.remult.repo(Complex).findId(cid, { useCache: false })
      if (!c) throw `Request-Id '${cid}' NOT EXISTS`
      title = `עדכון מתחם ${c.name}`
    }
    else {
      c = this.remult.repo(Complex).create()
      title = 'הוספת מתחם חדשה'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await c.save() },
        fields: () => [
          c.$.name,
          c.$.project]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openBuildingManagers(cid = '') {
    await openDialog(ConstructionContractorsComponent,
      ref => ref.args = {
        cid: cid
      })
  }

  async openBuildings(cid = '') {
    await openDialog(BuildingsComponent,
      ref => ref.args = {
        cid: cid
      })
  }

  async openComplexes(cid = '') {
    await openDialog(ComplexesComponent,
      ref => ref.args = {
        cid: cid
      })
  }

  async openApartments(cid = '') {
    const changed = await openDialog(ApartmentsComponent,
      ref => ref.args = {
        cid: cid
      })
  }

  async openTenants(cid = '') {
    await openDialog(TenantsComponent,
      ref => ref.args = {
        cid: cid
      })
  }

  async openRequests(cid = '') {
    await openDialog(RequestsComponent,
      ref => ref.args = {
        cid: cid
      })
  }

}

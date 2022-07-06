import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { BuildingsComponent } from '../../building/buildings/buildings.component';
import { ComplexesComponent } from '../../complex/complexes/complexes.component';
import { ConstructionContractorsComponent } from '../../construction-contractor/construction-contractors/construction-contractors.component';
import { RequestsComponent } from '../../request/requests/requests.component';
import { TenantsComponent } from '../../tenant/tenants/tenants.component';
import { Apartment } from '../apartment';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit {

  args: {
    pid?: string,
    cid?: string,
    bid?: string,
    aid?: string
  } = { pid: '', cid: '', bid: '', aid: '' }
  apartments!: GridSettings<Apartment>
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };

  @DataControl<ApartmentsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש דירה' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.apartments.reloadData()
  }

  async initGrid() {
    this.apartments = new GridSettings<Apartment>(this.remult.repo(Apartment), {
      where: {
        // project: this.args.pid?.length ? { $id: this.args.pid } : undefined,
        building: this.args.bid?.length ? { $id: this.args.bid } : undefined
      },
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
          click: async (row) => this.upsertApartment(row.id),
          showInLine: true,
          textInMenu: 'פרטי פרויקט',
          icon: 'edit'
        }
      ]
    })
  }

  async upsertApartment(aid = '') {
    if (!aid) aid = ''
    let c!: Apartment
    let title = ''
    if (aid.length) {
      c = await this.remult.repo(Apartment).findId(aid)
      if (!c) throw `Apartment-Id '${aid}' NOT EXISTS`
      title = `עדכון דירה ${c.number}`
    }
    else {
      c = this.remult.repo(Apartment).create()
      title = 'הוספת דירה חדשה'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await c.save() },
        fields: () => [
          c.$.number,
          c.$.floor]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openBuildingManagers(aid = '') {
    await openDialog(ConstructionContractorsComponent,
      ref => ref.args = {
        aid: aid
      })
  }

  async openBuildings(aid = '') {
    await openDialog(BuildingsComponent,
      ref => ref.args = {
        aid: aid
      })
  }

  async openComplexes(aid = '') {
    await openDialog(ComplexesComponent,
      ref => ref.args = {
        aid: aid
      })
  }

  async openApartments(aid = '') {
    const changed = await openDialog(ApartmentsComponent,
      ref => ref.args = {
        aid: aid
      })
  }

  async openTenants(aid = '') {
    await openDialog(TenantsComponent,
      ref => ref.args = {
        aid: aid
      })
  }

  async openRequests(aid = '') {
    await openDialog(RequestsComponent,
      ref => ref.args = {
        aid: aid
      })
  }

}

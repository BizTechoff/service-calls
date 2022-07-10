import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { ApartmentsComponent } from '../../apartment/apartments/apartments.component';
import { ComplexesComponent } from '../../complex/complexes/complexes.component';
import { ConstructionContractorsComponent } from '../../construction-contractor/construction-contractors/construction-contractors.component';
import { RequestsComponent } from '../../request/requests/requests.component';
import { TenantsComponent } from '../../tenant/tenants/tenants.component';
import { Building } from '../building';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit {

  args: {
    pid?: string,
    cid?: string,
    bid?: string,
    aid?: string,
    tid?: string
  } = { pid: '', cid: '', bid: '', aid: '' }
  buildings!: GridSettings<Building>
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };

  @DataControl<BuildingsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש בניין' })
  search = ''//customSearch

  async ngOnInit() {
    await this.initGrid()
  }

  async refresh() {
    await this.buildings.reloadData()
  }

  async initGrid() {
    this.buildings = new GridSettings<Building>(this.remult.repo(Building), {
      where: { complex: this.args.cid?.length ? { $id: this.args.cid } : undefined },
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
          click: async (row) => this.upsertBuilding(row.id),
          showInLine: true,
          textInMenu: 'פרטי פרויקט',
          icon: 'edit'
        }
      ]
    })
  }

  async upsertBuilding(cid = '') {
    if (!cid) cid = ''
    let c!: Building
    let title = ''
    if (cid.length) {
      c = await this.remult.repo(Building).findId(cid)
      if (!c) throw `Building-Id '${cid}' NOT EXISTS`
      title = `עדכון בניין ${c.name}`
    }
    else {
      c = this.remult.repo(Building).create()
      title = 'הוספת בניין חדשה'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        title: title,
        ok: async () => { await c.save() },
        fields: () => [
          c.$.name,
          c.$.innerName]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openBuildingManagers(bid = '') {
    await openDialog(ConstructionContractorsComponent,
      ref => ref.args = {
        bid: bid
      })
  }

  async openBuildings(bid = '') {
    await openDialog(BuildingsComponent,
      ref => ref.args = {
        bid: bid
      })
  }

  async openComplexes(bid = '') {
    await openDialog(ComplexesComponent,
      ref => ref.args = {
        bid: bid
      })
  }

  async openApartments(bid = '') {
    const changed = await openDialog(ApartmentsComponent,
      ref => ref.args = {
        bid: bid
      })
  }

  async openTenants(bid = '') {
    await openDialog(TenantsComponent,
      ref => ref.args = {
        bid: bid
      })
  }

  async openRequests(bid = '') {
    await openDialog(RequestsComponent,
      ref => ref.args = {
        bid: bid
      })
  }

}

import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { ApartmentsComponent } from '../../apartment/apartments/apartments.component';
import { Building } from '../building';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit {

  args: {
    cid: string
  } = { cid: '' }
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
      rowButtons: [
        {
          click: async (row) => this.openBuildingManagers(row.id),
          showInLine: true
        },
        {
          click: async (row) => this.openApartments(row.id),
          showInLine: true,
          textInMenu: 'דירות',
          icon: 'house'
        },
        {
          click: async (row) => this.openComplexes(row.id),
          showInLine: true
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
      title = `עדכון מתחם ${c.name}`
    }
    else {
      c = this.remult.repo(Building).create()
      title = 'הוספת מתחם חדשה'
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

  }

  async openApartments(bid = '') {
    const changed = await openDialog(ApartmentsComponent,
      ref => ref.args = {
        bid: bid
      })
  }

  async openComplexes(bid = '') {

  }

}

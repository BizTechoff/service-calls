import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { Apartment } from '../apartment';

@Component({
  selector: 'app-apartments',
  templateUrl: './apartments.component.html',
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit {

  args: {
    pid?: string,
    bid?: string
  } = { pid: '', bid: '' }
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
        project: this.args.pid?.length ? { $id: this.args.pid } : undefined,
        building: this.args.bid?.length ? { $id: this.args.bid } : undefined
      },
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

  async upsertBuilding(cid = '') {
    if (!cid) cid = ''
    let c!: Apartment
    let title = ''
    if (cid.length) {
      c = await this.remult.repo(Apartment).findId(cid)
      if (!c) throw `Apartment-Id '${cid}' NOT EXISTS`
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

  async openBuildingManagers(cid = '') {

  }

  async openBuildings(cid = '') {

  }

  async openComplexes(cid = '') {

  }

}

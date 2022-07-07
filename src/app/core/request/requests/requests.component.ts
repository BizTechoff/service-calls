import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Field, Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { User } from '../../../users/user';
import { ApartmentsComponent } from '../../apartment/apartments/apartments.component';
import { Building } from '../../building/building';
import { BuildingsComponent } from '../../building/buildings/buildings.component';
import { Complex } from '../../complex/complex';
import { ComplexesComponent } from '../../complex/complexes/complexes.component';
import { ConstructionContractorsComponent } from '../../construction-contractor/construction-contractors/construction-contractors.component';
import { Project } from '../../project/project';
import { ProjectsComponent } from '../../project/projects/projects.component';
import { SubContractorsComponent } from '../../sub-contractor/sub-contractors/sub-contractors.component';
import { TenantsComponent } from '../../tenant/tenants/tenants.component';
import { Category } from '../category';
import { Request } from '../request';
import { RequestStatus } from '../requestStatus';
@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

  args: {
    pid?: string,
    cid?: string,
    bid?: string,
    aid?: string,
    tid?: string,
    wid?: string,
    sid?: string
    category?: Category,
    status?: RequestStatus
  } = { pid: '', cid: '', bid: '', aid: '', tid: '', wid: '', sid: '' }
  requests!: GridSettings<Request>
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };

  @DataControl<RequestsComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש פנייה' })
  search = ''//customSearch

  @DataControl<RequestsComponent, Project>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openProjects()
  })
  @Fields.string({ caption: 'בחירת פרויקט' })
  project!: Project//customSearch

  @DataControl<RequestsComponent, Complex>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openComplexes()
  })
  @Fields.string({ caption: 'בחירת מתחם' })
  complex!: Complex//customSearch

  @DataControl<RequestsComponent, Building>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openBuildings()
  })
  @Fields.string({ caption: 'בחירת בניין' })
  building!: Building//customSearch

  @DataControl<RequestsComponent, User>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openTenants()
  })
  @Fields.string({ caption: 'בחירת דייר' })
  tenant!: User//customSearch

  @DataControl<RequestsComponent, Project>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openBuildingManagers()
  })
  @Fields.string({ caption: 'בחירת מנהל עבודה' })
  workManager!: User//customSearch

  @DataControl<RequestsComponent, Project>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openSubContractor()
  })
  @Fields.string({ caption: 'בחירת קבלן משנה' })
  subContractor!: User//customSearch

  @DataControl<RequestsComponent, RequestStatus>({
    valueChange: async row => await row?.refresh(),
    // clickIcon: 'search',
    // click: async (row, col) => { }
  })
  @Field(() => RequestStatus, { caption: 'בחירת סטטוס' })
  status!: RequestStatus//customSearch

  @DataControl<RequestsComponent, Category>({
    valueChange: async row => await row?.refresh(),
    // clickIcon: 'search',
    // click: async (row, col) => { }
  })
  @Field(() => Category, { caption: 'בחירת מחלקה' })
  category!: Category//customSearch

  async ngOnInit() {
    if (this.args.pid?.trim().length) {
      this.project = await this.remult.repo(Project).findId(this.args.pid)
    }
    if (this.args.cid?.trim().length) {
      this.complex = await this.remult.repo(Complex).findId(this.args.cid)
    }
    if (this.args.bid?.trim().length) {
      this.building = await this.remult.repo(Building).findId(this.args.bid)
    }
    // if (this.args.aid?.trim().length) {
    //   this.apartment = await this.remult.repo(Apartment).findId(this.args.aid)
    // }
    if (this.args.tid?.trim().length) {
      this.tenant = await this.remult.repo(User).findId(this.args.tid)
    }
    if (this.args.wid?.trim().length) {
      this.workManager = await this.remult.repo(User).findId(this.args.wid)
    }
    if (this.args.sid?.trim().length) {
      this.subContractor = await this.remult.repo(User).findId(this.args.sid)
    }
    if (this.args.category) {
      this.category = this.args.category
    }
    if (this.args.status) {
      this.status = this.args.status
    }
    await this.initGrid()
  }

  async refresh() {
    await this.requests.reloadData()
  }

  async initGrid() {
    this.requests = new GridSettings<Request>(this.remult.repo(Request), {
      where: {
        project: this.project,
        complex: this.complex,
        building: this.building,
        // apartment: this.apartment,
        tenant: this.tenant,
        workManager: this.workManager,
        subContractor: this.subContractor,
        category: this.category,
        status: this.status,
      },
      numOfColumnsInGrid: 10,
      columnSettings: row => [
        row.category,
        row.description,
        row.date,
        row.time,
        row.status],
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
          click: async (row) => this.openProjects(row.id),
          showInLine: true,
          textInMenu: 'פרויקטים',
          icon: 'confirmation_number'
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
          click: async (row) => this.upserRequest(row.id),
          showInLine: true,
          textInMenu: 'פרטי פנייה',
          icon: 'edit'
        }
      ]
    })
  }

  async upserRequest(aid = '') {
    if (!aid) aid = ''
    let r!: Request
    let title = ''
    if (aid.length) {
      r = await this.remult.repo(Request).findId(aid, { useCache: false })
      if (!r) throw `Request-Id '${aid}' NOT EXISTS`
      title = `עדכון פנייה ${r.date}`
    }
    else {
      r = this.remult.repo(Request).create()
      r.project = this.project
      r.complex = this.complex
      r.building = this.building
      r.tenant = this.tenant
      r.category = this.category
      r.workManager = this.workManager
      r.subContractor = this.subContractor
      r.date = new Date()
      r.time = new Date().getTime() + ''
      title = 'הוספת פנייה חדשה'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        disableClose: true,
        title: title,
        buttons: [
          {
            text: 'קבצים',
            click: async () => await this.openFiles(r?.apartment?.id)
          }
        ],
        ok: async () => { await r.save() },
        fields: () => [
          [
            r.$.project,
            r.$.complex,
            r.$.building,
            r.$.apartment,
            r.$.tenant,
            r.$.category,
            r.$.status
          ],
          [
            { field: r.$.date, width: '100%' },
            { field: r.$.time, width: '100%' }
          ],
          r.$.description,
          [
            { field: r.$.workManager, width: '100%' },
            { field: r.$.subContractor, width: '100%' }
          ],
          [
            { field: r.$.workerCount, width: '100%' },
            { field: r.$.workHours, width: '100%' }
          ],
          r.$.workDescription
        ]
      },
      ref => ref ? ref.ok : false)
    if (changed) {
      this.refresh()
    }
  }

  async openFiles(tid: string) {

    // const changed = await openDialog(InputAreaComponent,
    //   ref => ref.args = {
    //     title: 'בחירת קבצי דירה',
    //     ok: () => { }
    //   },
    //   ref => ref ? ref.ok : false)
  }

  async openBuildingManagers(rid = '') {
    await openDialog(ConstructionContractorsComponent);
  }

  async openProjects(rid = '') {
    await openDialog(ProjectsComponent);
  }

  async openBuildings(rid = '') {
    await openDialog(BuildingsComponent);
  }

  async openComplexes(rid = '') {
    await openDialog(ComplexesComponent);
  }

  async openApartments(rid = '') {
    await openDialog(ApartmentsComponent);
  }

  async openTenants(rid = '') {
    await openDialog(TenantsComponent);
  }

  async openSubContractor(rid = '') {
    await openDialog(SubContractorsComponent);
  }

}

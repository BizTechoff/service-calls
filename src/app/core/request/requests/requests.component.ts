import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Field, Fields, getFields, Remult } from 'remult';
import { DialogService } from '../../../common/dialog';
import { InputAreaComponent } from '../../../common/input-area/input-area.component';
import { User } from '../../../users/user';
import { Apartment } from '../../apartment/apartment';
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

  NUM_OF_APARTMENTS_IN_FLOOR = 4

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
  constructor(private remult: Remult, private dialog: DialogService) { }
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
  @Field<RequestsComponent, Project>(() => Project, { caption: 'בחירת פרויקט' })
  project!: Project//customSearch

  @DataControl<RequestsComponent, Complex>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openComplexes()
  })
  @Field<RequestsComponent, Complex>(() => Complex, { caption: 'בחירת מתחם' })
  complex!: Complex//customSearch

  @DataControl<RequestsComponent, Building>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openBuildings()
  })
  @Field<RequestsComponent, Building>(() => Building, { caption: 'בחירת בניין' })
  building!: Building//customSearch

  @DataControl<RequestsComponent, User>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openTenants()
  })
  @Field<RequestsComponent, User>(() => User, (options, remult) => {
    options.caption = 'בחירת דייר'
    options.displayValue = (row, col) => col?.$.name?.value
  })
  tenant!: User//customSearch

  @DataControl<RequestsComponent, Project>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openBuildingManagers()
  })
  @Field<RequestsComponent, User>(() => User, { caption: 'בחירת מנהל עבודה' })
  workManager!: User//customSearch

  @DataControl<RequestsComponent, Project>({
    valueChange: async row => await row?.refresh(),
    clickIcon: 'search',
    hideDataOnInput: true,
    click: async row => await row?.openSubContractor()
  })
  @Field<RequestsComponent, User>(() => User, { caption: 'בחירת קבלן משנה' })
  subContractor!: User//customSearch

  @DataControl<RequestsComponent, RequestStatus>({
    valueChange: async row => await row?.refresh(),
    // clickIcon: 'search',
    // click: async (row, col) => { }
  })
  @Field<RequestsComponent, RequestStatus>(() => RequestStatus, { caption: 'בחירת סטטוס' })
  status!: RequestStatus//customSearch

  @DataControl<RequestsComponent, Category>({
    valueChange: async row => await row?.refresh(),
    // clickIcon: 'search',
    // click: async (row, col) => { }
  })
  @Field<RequestsComponent, Category>(() => Category, { caption: 'בחירת מחלקה' })
  category!: Category//customSearch

  async ngOnInit() {
    console.log(1)
    if (this.args.pid?.trim().length) {
      this.project = await this.remult.repo(Project).findId(this.args.pid)
    }
    console.log(2)
    if (this.args.cid?.trim().length) {
      console.log(21)
      this.complex = await this.remult.repo(Complex).findId(this.args.cid)
      console.log(22)
    }
    console.log(3)
    if (this.args.bid?.trim().length) {
      this.building = await this.remult.repo(Building).findId(this.args.bid)
    }
    // if (this.args.aid?.trim().length) {
    //   this.apartment = await this.remult.repo(Apartment).findId(this.args.aid)
    // }
    console.log(4)
    if (this.args.tid?.trim().length) {
      this.tenant = await this.remult.repo(User).findId(this.args.tid)
    }
    console.log(5)
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
          click: async row => await this.openBuildingManagers(row?.workManager?.id),
          showInLine: true,
          textInMenu: 'מנהלי עבודה',
          icon: 'engineering'
        },
        {
          click: async row => await this.openProjects(row?.project?.id),
          showInLine: true,
          textInMenu: 'פרויקטים',
          icon: 'confirmation_number'
        },
        {
          click: async row => await this.openComplexes(row?.complex?.id),
          showInLine: true,
          textInMenu: 'מתחמים',
          icon: 'workspaces'
        },
        {
          click: async row => await this.openBuildings(row?.building?.id),
          showInLine: true,
          textInMenu: 'בניינים',
          icon: 'location_city'
        },
        {
          click: async row => await this.openApartments(row?.apartment?.id),
          showInLine: true,
          textInMenu: 'דירות',
          icon: 'house'
        },
        {
          click: async row => await this.openTenants(row?.tenant?.id),
          showInLine: true,
          textInMenu: 'דיירים',
          icon: 'groups'
        },
        {
          click: async row => await this.upserRequest(row.id),
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
      title = 'פתיחת פנייה חדשה'
    }
    const changed = await openDialog(InputAreaComponent,
      ref => ref.args = {
        disableClose: () => r._.wasChanged(),
        title: title,
        buttons:

          r.isNew()
            ? [{
              text: 'קבצים',
              click: async () => await this.openFiles(r?.apartment?.id)
            }]
            : [{
              text: 'קבצים',
              click: async () => await this.openFiles(r?.apartment?.id)
            },
            {
              text: 'סגירת פנייה',
              click: async () => await this.openFiles(r?.apartment?.id)
            },
            {
              text: 'שיבוץ מטפל',
              click: async () => await this.openFiles(r?.apartment?.id)
            },
            {
              text: 'דירה מעליו',
              click: async () => await this.openApartmentAbove(r?.apartment?.id)
            },
            {
              text: 'דירה מתחתיו',
              click: async () => await this.openApartmentBelow(r?.apartment?.id)
            }],
        ok: async () => { await r.save() },
        fields: () => [
          [
            r.$.project,
            r.$.complex,
            r.$.building,
            r.$.apartment,
            r.$.tenant,
            r.$.status
          ],
          [
            { field: r.$.date, width: '100%' },
            { field: r.$.time, width: '100%' }
          ],
          [
            r.$.category,
            r.$.space,
            r.$.description
          ],
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
      ref => ref?.ok ?? false)
    if (changed) {
      this.refresh()
    }
  }

  async openApartmentAbove(aid: string) {
    if (!aid) aid = ''
    if (aid.length) {
      let a = await this.remult.repo(Apartment).findId(aid, { useCache: false })
      if (!a) throw `openApartmentAbove( aid:${aid} ) NOT EXISTS`
      let above = await this.remult.repo(Apartment).findFirst({
        building: a.building,
        floor: a.floor + 1,
        number: a.number + this.NUM_OF_APARTMENTS_IN_FLOOR
      })
      if (!above) {
        this.dialog.info("הדייר בקומה הכי עליונה")
      }
      else {
        await openDialog(ApartmentsComponent,
          ref => ref.args = { aid: above.id })
      }
    }
    else {
      this.dialog.info("openApartmentAbove(aid: '${aid}' NOT VALID")
    }
  }

  async openApartmentBelow(aid: string) {
    if (!aid) aid = ''
    if (aid.length) {
      let a = await this.remult.repo(Apartment).findId(aid, { useCache: false })
      if (!a) throw `openApartmentBelow( aid:${aid} ) NOT EXISTS`
      let below = await this.remult.repo(Apartment).findFirst({
        building: a.building,
        floor: a.floor - 1,
        number: a.number - this.NUM_OF_APARTMENTS_IN_FLOOR
      })
      if (!below) {
        this.dialog.info("הדייר בקומה הכי תחתונה")
      }
      else {
        await openDialog(ApartmentsComponent,
          ref => ref.args = { aid: below.id })
      }
    }
    else {
      this.dialog.info("openApartmentBelow(aid: '${aid}' NOT VALID")
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

  async openProjects(pid = '') {
    if (!pid) pid = ''
    if (pid.length) {
      let p = await this.remult.repo(Project).findId(pid, { useCache: false })
      if (!p) throw `Project id ${pid} NOT EXISTS`
      await openDialog(ProjectsComponent,
        ref => ref.args = { pid: pid });
    }
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

  async cleanParams() {
    let yes = await this.dialog.yesNoQuestion('לנקות את הערכים של הסינון?')
    if (yes) {
      this.project = undefined!
      this.complex = undefined!
      this.building = undefined!
      this.tenant = undefined!
      this.workManager = undefined!
      this.subContractor = undefined!
      this.category = undefined!
      this.status = undefined!
      this.dialog.info('ערכים נוקו')
      this.refresh()
    }
  }

}

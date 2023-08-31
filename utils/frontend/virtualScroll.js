const { throttle } = require('./tools');

export class VShandler {
  #records;
  #virtualScrollArea;
  #recordContainer;
  #displayArea;
  #scrollAreaHeight;
  #displayRecordsNum;
  #recordHeight;
  #paddingRecordsNum;
  #viewAreaYval;

  constructor(records, virtualScrollAreaId, recordsContainerId, displayAreaId, scrollAreaHeight, displayRecordsNum, paddingRecordsNum) {
    this.#records = records;
    this.#virtualScrollArea = document.getElementById(virtualScrollAreaId);
    this.#recordContainer = document.getElementById(recordsContainerId);
    this.#displayArea = document.getElementById(displayAreaId);

    if (this.#records === undefined || !(this.#records instanceof Array) || this.#virtualScrollArea === undefined || this.#recordContainer === undefined
      || this.#displayArea === undefined) {
      throw new Error('Invalid parameters for virtual scroll');
    }

    this.#scrollAreaHeight = scrollAreaHeight || 500;
    this.#displayRecordsNum = displayRecordsNum || 5;
    this.#recordHeight = this.#scrollAreaHeight / this.#displayRecordsNum;
    this.#paddingRecordsNum = paddingRecordsNum || 2;

    this.#virtualScrollArea.style.height = `${this.#scrollAreaHeight}px`;
    this.#recordContainer.style.height = `${this.#records.length * this.#recordHeight}px`;
    this.#viewAreaYval = this.#virtualScrollArea.getBoundingClientRect().y;
    this.#virtualScrollArea.addEventListener('scroll', throttle(this.#virtualScrollContent.bind(this)));
  }

  handleScrollContentChange(records) {
    this.#records = records;
    this.#recordContainer.style.height = `${this.#records.length * this.#recordHeight}px`;
    this.#virtualScrollArea.scrollTop = 0;
    this.#updateContentOfScrollTo(0, this.#displayRecordsNum + 2 * this.#paddingRecordsNum);
    this.#configHandlerBtnRecordId();
  }

  #updateContentOfScrollTo(startIndex, amount) {
    this.#displayArea.innerHTML = this.#records.slice(startIndex, startIndex + amount).reduce((html, record, index) => {
      const isGrayBg = (startIndex + index) % 2 === 0;
      html += `
        <div class="row px-2" data-record-id="${record.id}" id="scrollItem${index}" style="height:${this.#recordHeight}px;${isGrayBg ? 'background-color:rgb(241, 241, 241)' : ''}">
          <div class="col-2 d-flex justify-content-end align-items-center pa-0" style="color: rgb(162, 225, 233);">
            <i class="${record.categoryIcon}" style="font-size: 56px"></i>
          </div>
          <div class="col-10 d-flex justify-content-between align-items-center"">
            <div class="p-2">
              <div class="fs-3 fw-bold">${record.name}</div>
              <div class="fs-5">${record.date}</div>
            </div>
            <span class="fs-4 me-2">${record.amount.toLocaleString('zh-hant')}</span>
          </div>
        </div>
      `;
      return html;
    }, '');
  }

  #configHandlerBtnRecordId() {
    if (!this.#displayArea.children.length) return;

    const firstScrollItemMidPos = this.#displayArea.children[0].getBoundingClientRect().y + (this.#recordHeight >> 1);
    const startIndex = (firstScrollItemMidPos > this.#viewAreaYval)
      ? 0 : (firstScrollItemMidPos + 100 > this.#viewAreaYval)
        ? 1 : 2;
    const endIndex = startIndex + Math.min(this.#records.length, 5);
    let btnIndex = 0;

    for (let i = startIndex; i < endIndex; i++) {
      const curRecordId = this.#displayArea.children[i].dataset.recordId;
      const curRecordIndex = this.#records.findIndex((record) => record.id === Number(curRecordId));
      const editRecordEle = document.getElementById(`editBtn${btnIndex}`);
      const delRecordEle = document.getElementById(`deleteForm${btnIndex}`);

      editRecordEle.setAttribute('href', `/records/${curRecordId}/edit`);
      delRecordEle.setAttribute('action', `/records/${curRecordId}?_method=DELETE`);
      delRecordEle.dataset.recordInfo = `[${this.#records[curRecordIndex].date}] ${this.#records[curRecordIndex].name} \$${this.#records[curRecordIndex].amount}`;
      btnIndex++;
    }
  }

  #virtualScrollContent(event) {
    const renderStartIndex = Math.max(
      Math.ceil(event.target.scrollTop / this.#recordHeight) - this.#paddingRecordsNum, 0
    );
    const renderAmount = Math.min(
      Math.ceil(this.#scrollAreaHeight / this.#recordHeight) + 2 * this.#paddingRecordsNum,
      this.#records.length - renderStartIndex,
    );
    const moveDist = renderStartIndex * this.#recordHeight;

    this.#displayArea.style.transform = `translateY(${moveDist}px)`;
    this.#updateContentOfScrollTo(renderStartIndex, renderAmount);
    this.#configHandlerBtnRecordId();
  }
}

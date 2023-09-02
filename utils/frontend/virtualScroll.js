import { throttle } from './tools';

export class VShandler {
  #items;
  #virtualScrollArea;
  #itemsContainer;
  #viewport;
  #viewportHeight;
  #itemNumInViewport;
  #recordHeight;
  #paddingNum;
  #renderItemNum;
  #viewAreaYval;
  #itemOperArea;
  /**
   * Make the element with large number of items to virtual scroll
   * @param {object} config - Configuration for virtual scroll
   * @param {Array} config.items - A large number of data.
   * @param {String} config.virtualScrollAreaId - Id of the element for virtual scroll.
   * @param {Number} [config.viewportHeight=500] - Height of the viewport (virtual scroll area).
   * @param {Number} [config.itemNumInViewport=5] - The number of item to show in the viewport.
   * @param {Number} [config.paddingNum=10] - The number of extra items outside the viewport (for better smoothly scroll).
   * @param {Boolean} [config.needItemOper=false] - Extra functional button for manipulating the items inside viewport.
   */
  constructor({ items, virtualScrollAreaId, viewportHeight = 500, itemNumInViewport = 5, paddingNum = 10, needItemOper = true }) {
    if (items === undefined || !(items instanceof Array)) {
      throw new Error('The reference of the items for virtual scrolling is required');
    }
    if (virtualScrollAreaId === undefined || !document.getElementById(virtualScrollAreaId)) {
      throw new Error('The element for virtual scrolling is required.')
    }

    this.#items = items;
    this.#virtualScrollArea = document.getElementById(virtualScrollAreaId);
    this.#virtualScrollArea.innerHTML = `
      <div id="itemsContainer" style="overflow:hidden;">
        <div id="viewport"></div>
      </div>
    `;
    this.#itemsContainer = document.getElementById('itemsContainer');
    this.#viewport = document.getElementById('viewport');

    this.#viewportHeight = viewportHeight;
    this.#itemNumInViewport = itemNumInViewport;
    this.#recordHeight = this.#viewportHeight / this.#itemNumInViewport;
    this.#paddingNum = paddingNum;
    this.#renderItemNum = itemNumInViewport + paddingNum * 2;

    this.#virtualScrollArea.style.height = `${this.#viewportHeight}px`;
    this.#itemsContainer.style.height = `${this.#items.length * this.#recordHeight}px`;
    if (needItemOper) this.#initItemOperArea();

    this.#viewAreaYval = this.#virtualScrollArea.getBoundingClientRect().y;
    this.#virtualScrollArea.addEventListener('scroll', throttle(this.#virtualScrollContent.bind(this)));
  }

  #initItemOperArea() {
    this.#itemOperArea = document.createElement('div');
    this.#itemOperArea.classList.add('h-100', 'd-flex', 'flex-column');
    this.#itemOperArea.style.cssText = 'position: absolute;top: 0;left: 80%;';
    this.#itemOperArea.innerHTML = Array.from(
      { length: this.#itemNumInViewport }, (_, index) => index,
    ).reduce((html, index) => (
      html + '<div class="btnField" style="height:20%">'
      + `${index < this.#items.length
        ? `
            <a href="/records/${this.#items[index].id}/edit" class="btn btn-primary" id="editBtn${index}"></a>
            <form action="/records/${this.#items[index].id}?_method=DELETE" method="post" style="display:inline-block;" id="deleteForm${index}"
              data-record-info="[${this.#items[index].date}] ${this.#items[index].name} \$${this.#items[index].amount}"  onsubmit="handleDeleteReq(event)">
              <button type="submit" class="btn btn-danger""></button>
            </form>
          `
        : ''
      }`
      + '</div>'
    ), '');
    this.#virtualScrollArea.after(this.#itemOperArea);
  }

  #updateContentOfScrollTo(startIndex, amount) {
    this.#viewport.innerHTML = this.#items.slice(startIndex, startIndex + amount).reduce((html, record, index) => {
      const isGrayBg = (startIndex + index) % 2 === 0;
      html += `
        <div class="row px-2" id="scrollItem${index}" style="height:${this.#recordHeight}px;${isGrayBg ? 'background-color:rgb(241, 241, 241)' : ''}"
          data-id="${record.id}" data-name="${record.name}" data-date="${record.date}" data-amount="${record.amount}">
          <div class="col-2 d-flex justify-content-end align-items-center pa-0" style="color: rgb(162, 225, 233);">
            <i class="${record.categoryIcon}" style="font-size: 56px"></i>
          </div>
          <div class="col-10 d-flex justify-content-between align-items-center"">
            <div class="p-2">
              <div class="fs-3 fw-bold">${record.name}</div>
              <div class="fs-5">${record.date}</div>
            </div>
            <span class="fs-4 me-2">${record.amount.toLocaleString('zh-Hant')}</span>
          </div>
        </div>
      `;
      return html;
    }, '');
  }

  #getFirstRecordIndexInViewport() {
    const recordEles = Array.from(this.#viewport.children);

    if (!recordEles.length) return 0;

    const firstElePos = recordEles[0].getBoundingClientRect().y + this.#recordHeight * 0.3;
    for (let elePos = firstElePos, index = 0; index < recordEles.length; index++, elePos += this.#recordHeight) {
      if (elePos > this.#viewAreaYval) return index;
    }

    return Infinity;
  }

  #configHandlerBtnRecordId() {
    const startIndex = this.#getFirstRecordIndexInViewport();
    const endIndex = startIndex + Math.min(this.#items.length, 5);
    let btnIndex = 0;

    for (let i = startIndex; i < endIndex; i++) {
      const recordInfo = this.#viewport.children[i].dataset;
      const editRecordEle = document.getElementById(`editBtn${btnIndex}`);
      const delRecordEle = document.getElementById(`deleteForm${btnIndex}`);

      editRecordEle.setAttribute('href', `/records/${recordInfo.id}/edit`);
      delRecordEle.setAttribute('action', `/records/${recordInfo.id}?_method=DELETE`);
      delRecordEle.dataset.recordInfo = `[${recordInfo.date}] ${recordInfo.name} \$${recordInfo.amount}`;
      btnIndex++;
    }
  }

  #virtualScrollContent(event) {
    const renderStartIndex = Math.max(
      Math.ceil(event.target.scrollTop / this.#recordHeight) - this.#paddingNum, 0
    );

    this.#viewport.style.transform = `translateY(${renderStartIndex * this.#recordHeight}px)`;
    this.#updateContentOfScrollTo(renderStartIndex, this.#renderItemNum);
    if (this.#itemOperArea) this.#configHandlerBtnRecordId();
  }

  handleScrollContentChange(items) {
    this.#items = items;
    this.#itemsContainer.style.height = `${this.#items.length * this.#recordHeight}px`;
    this.#virtualScrollArea.scrollTop = 0;
    this.#updateContentOfScrollTo(0, this.#renderItemNum);
    if (this.#itemOperArea) this.#configHandlerBtnRecordId();
  }
}

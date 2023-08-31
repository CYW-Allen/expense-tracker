const { throttle } = require('./tools');

let scrollRecordsHandler;

function handleVirtualScroll(records) {
  const scrollAreaHeight = 500;
  const displayRecords = 5;
  const recordHeight = scrollAreaHeight / displayRecords;
  const paddingRecordsNum = 2;
  const virtualScrollArea = document.getElementById('virtualScrollArea');
  const viewAreaYval = virtualScrollArea.getBoundingClientRect().y;

  function updateContentOfScrollTo(records, startIndex, amount) {
    document.getElementById('displayArea').innerHTML = records.slice(startIndex, startIndex + amount).reduce((html, record, index) => {
      const isGrayBg = (startIndex + index) % 2 === 0;
      html += `
        <div class="row px-2" data-record-id="${record.id}" id="scrollItem${index}" style="height:${recordHeight}px;${isGrayBg ? 'background-color:rgb(241, 241, 241)' : ''}">
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

  function configHandlerBtnRecordId() {
    if (!document.getElementById('scrollItem0')) return;
    
    const firstScrollItemMidPos = document.getElementById('scrollItem0').getBoundingClientRect().y + (recordHeight >> 1);
    const startIndex = (firstScrollItemMidPos > viewAreaYval)
      ? 0 : (firstScrollItemMidPos + 100 > viewAreaYval)
        ? 1 : 2;
    const endIndex = startIndex + Math.min(records.length, 5);
    let btnIndex = 0;

    for (let i = startIndex; i < endIndex; i++) {
      const curRecordId = document.getElementById(`scrollItem${i}`).dataset.recordId;
      const curRecordIndex = records.findIndex((record) => record.id === Number(curRecordId));

      document.getElementById(`edit-btn-${btnIndex}`).setAttribute('href', `/records/${curRecordId}/edit`);
      document.getElementById(`deleteForm${btnIndex}`).setAttribute('action', `/records/${curRecordId}?_method=DELETE`);
      document.getElementById(`deleteForm${btnIndex}`).dataset.recordInfo = `[${records[curRecordIndex].date}] ${records[curRecordIndex].name} \$${records[curRecordIndex].amount}`;
      btnIndex++;
    }
  }

  function virtualScrollContent(event) {
    const renderStartIndex = Math.max(
      Math.ceil(event.target.scrollTop / recordHeight) - paddingRecordsNum, 0
    );
    const renderAmount = Math.min(
      Math.ceil(scrollAreaHeight / recordHeight) + 2 * paddingRecordsNum,
      records.length - renderStartIndex,
    );
    const moveDist = renderStartIndex * recordHeight;

    document.getElementById('displayArea').style.transform = `translateY(${moveDist}px)`;
    updateContentOfScrollTo(records, renderStartIndex, renderAmount);
    configHandlerBtnRecordId();
  }

  if (scrollRecordsHandler) virtualScrollArea.removeEventListener('scroll', scrollRecordsHandler);
  document.getElementById('virtualScrollArea').scrollTop = 0;

  virtualScrollArea.style.height = `${scrollAreaHeight}px`;
  document.getElementById('recordsContainer').style.height = `${records.length * recordHeight}px`;
  updateContentOfScrollTo(records, 0, displayRecords + 2 * paddingRecordsNum);
  configHandlerBtnRecordId();
  scrollRecordsHandler = throttle(virtualScrollContent);
  virtualScrollArea.addEventListener('scroll', scrollRecordsHandler);
}

export { handleVirtualScroll }

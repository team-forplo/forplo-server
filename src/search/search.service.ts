import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SearchService {
  private readonly BASE_URL =
    'http://api.visitkorea.or.kr/openapi/service/rest';

  getFormatDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    const formatMonth = month >= 10 ? month : '0' + month;
    const formatDate = date >= 10 ? date : '0' + date;
    return `${year}${formatMonth}${formatDate}`;
  }

  async findTopList() {
    // 지역 기반 관광 정보 조회 (조회순)
    const areaBasedList = await axios.get(
      `${this.BASE_URL}/KorService/areaBasedList?ServiceKey=${process.env.TOUR_API_SERVICE_KEY}&MobileApp=forplo&MobileOS=AND&_type=json`,
      {
        params: {
          numOfRows: 310,
          arrange: 'P',
          contentTypeId: 12,
        },
      },
    );
    let areaBaseItemList = areaBasedList.data.response.body.items.item;

    // 오늘의 추천 여행지 목록 선택 알고리즘은 추후 변경해야 함.
    const todayDate = new Date().getDate();
    const sliceStart = (todayDate - 1) * 10;
    areaBaseItemList = areaBaseItemList.slice(sliceStart, sliceStart + 10);

    // 개요 및 상세 정보 포함한 목록
    return await Promise.all(
      areaBaseItemList.map(async (item) => {
        const { contentid, title, addr1, firstimage, firstimage2, mapx, mapy } =
          item || {};

        const detailCommon = await axios.get(
          `${this.BASE_URL}/KorService/detailCommon?ServiceKey=${process.env.TOUR_API_SERVICE_KEY}&MobileApp=forplo&MobileOS=AND&_type=json`,
          {
            params: {
              contentId: contentid,
              overviewYN: 'Y',
            },
          },
        );
        const { contenttypeid, overview } =
          detailCommon.data.response.body.items.item || {};

        const detailIntro = await axios.get(
          `${this.BASE_URL}/KorService/detailIntro?ServiceKey=${process.env.TOUR_API_SERVICE_KEY}&MobileApp=forplo&MobileOS=AND&_type=json`,
          {
            params: {
              contentId: contentid,
              contentTypeId: contenttypeid,
            },
          },
        );
        const { infocenter } = detailIntro.data.response.body.items.item || {};

        const today = this.getFormatDate();
        const tarDecoList = await axios.get(
          `${this.BASE_URL}/DataLabService/tarDecoList?ServiceKey=${process.env.TOUR_API_SERVICE_KEY}&MobileApp=forplo&MobileOS=AND&_type=json`,
          {
            params: {
              numOfRows: 1,
              pageNo: 1,
              startYmd: today,
              endYmd: today,
              contentId: contentid,
            },
          },
        );

        const { estiDecoDivCd } =
          tarDecoList.data.response.body.items.item || {};

        return {
          contentid,
          title,
          addr1,
          firstimage,
          firstimage2,
          infocenter,
          mapx,
          mapy,
          overview,
          estiDecoDivCd,
        };
      }),
    );
  }
}

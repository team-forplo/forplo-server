import { BookmarkService } from './../bookmark/bookmark.service';
import { cat2Mapper } from './mapper/cat2.mapper';
import { cat1Mapper } from './mapper/cat1.mapper';
import { areaCodeMapper } from './mapper/area.mapper';
import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class SearchService {
  constructor(private readonly bookmarkService: BookmarkService) {}

  private readonly BASE_URL =
    'http://api.visitkorea.or.kr/openapi/service/rest';
  private readonly COMMON_QUERY_SUYEON = `ServiceKey=${process.env.TOUR_API_SERVICE_KEY_SUYEON}&MobileApp=forplo&MobileOS=AND&_type=json`;
  private readonly COMMON_QUERY = `ServiceKey=${process.env.TOUR_API_SERVICE_KEY}&MobileApp=forplo&MobileOS=AND&_type=json`;

  getFormatDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    const formatMonth = month >= 10 ? month : '0' + month;
    const formatDate = date >= 10 ? date : '0' + date;
    return `${year}${formatMonth}${formatDate}`;
  }

  getFormatEstiDecoDivCd(estiDecoDivCd: number) {
    let formatEstiDecoDivCd;
    switch (estiDecoDivCd) {
      case 1:
        formatEstiDecoDivCd = '쾌적';
        break;
      case 2:
        formatEstiDecoDivCd = '여유';
        break;
      case 3:
        formatEstiDecoDivCd = '보통';
        break;
      case 4:
        formatEstiDecoDivCd = '약간혼잡';
        break;
      case 5:
        formatEstiDecoDivCd = '혼잡';
        break;
      default:
        formatEstiDecoDivCd = '쾌적';
        break;
    }
    return formatEstiDecoDivCd;
  }

  // 키워드 검색 조회
  async searchKeyword(params: any) {
    const searchKeyword = await axios.get(
      `${this.BASE_URL}/KorService/searchKeyword?${this.COMMON_QUERY}`,
      {
        params,
      },
    );
    return searchKeyword.data.response.body || {};
  }

  // 지역 기반 관광 정보 조회
  async areaBasedList(params: any) {
    const areaBasedList = await axios.get(
      `${this.BASE_URL}/KorService/areaBasedList?${this.COMMON_QUERY}`,
      {
        params,
      },
    );
    return areaBasedList.data.response.body.items.item || {};
  }

  // 공통정보 조회
  async detailCommon(params: any) {
    const detailCommon = await axios.get(
      `${this.BASE_URL}/KorService/detailCommon?${this.COMMON_QUERY}`,
      {
        params,
      },
    );
    return detailCommon.data.response.body.items.item || {};
  }

  // 소개정보 조회
  async detailIntro(params: any) {
    const detailIntro = await axios.get(
      `${this.BASE_URL}/KorService/detailIntro?${this.COMMON_QUERY}`,
      {
        params,
      },
    );
    return detailIntro.data.response.body.items.item || {};
  }

  // 관광지별 혼잡도 예측 집계 데이터 정보 조회
  async tarDecoList(params: any) {
    const tarDecoList = await axios.get(
      `${this.BASE_URL}/DataLabService/tarDecoList?${this.COMMON_QUERY_SUYEON}`,
      {
        params,
      },
    );
    const { estiDecoDivCd } = tarDecoList.data.response.body.items.item || {};
    return this.getFormatEstiDecoDivCd(estiDecoDivCd);
  }

  // 오늘의 추천 여행지 조회
  async findTopList() {
    // 지역 기반 관광 정보 조회 (조회순)
    let areaBaseItemList = await this.areaBasedList({
      numOfRows: 310,
      arrange: 'P',
    });

    // 오늘의 추천 여행지 목록 선택 알고리즘은 추후 변경해야 함.
    const todayDate = new Date().getDate();
    const sliceStart = (todayDate - 1) * 10;
    areaBaseItemList = areaBaseItemList.slice(sliceStart, sliceStart + 10);

    // 개요 포함한 목록
    return await Promise.all(
      areaBaseItemList.map(async (item) => {
        const {
          contentid,
          contenttypeid,
          title,
          addr1,
          firstimage,
          firstimage2,
        } = item || {};

        const { overview } = await this.detailCommon({
          contentId: contentid,
          overviewYN: 'Y',
        });

        return {
          contentid,
          contenttypeid,
          title,
          addr1,
          firstimage,
          firstimage2,
          overview,
        };
      }),
    );
  }

  // 국내여행 상세 조회
  async findDetail(contentid: number, user: User) {
    const bookmark = await this.bookmarkService.findOne(contentid, user);
    const isBookmark = bookmark ? true : false;

    const {
      contenttypeid,
      title,
      firstimage,
      firstimage2,
      addr1,
      mapx,
      mapy,
      overview,
    } = await this.detailCommon({
      contentId: contentid,
      defaultYN: 'Y',
      firstImageYN: 'Y',
      areacodeYN: 'Y',
      addrinfoYN: 'Y',
      mapinfoYN: 'Y',
      overviewYN: 'Y',
    });

    const {
      infocenter,
      infocenterculture,
      sponsor1tel,
      infocenterleports,
      infocenterlodging,
      infocentershopping,
      infocenterfood,
    } = await this.detailIntro({
      contentId: contentid,
      contentTypeId: contenttypeid,
    });
    const infoNumber =
      infocenter ||
      infocenterculture ||
      sponsor1tel ||
      infocenterleports ||
      infocenterlodging ||
      infocentershopping ||
      infocenterfood;

    const today = this.getFormatDate();
    const estiDecoDivCd = await this.tarDecoList({
      numOfRows: 1,
      pageNo: 1,
      startYmd: today,
      endYmd: today,
      contentId: contentid,
    });

    return {
      isBookmark,
      contentid,
      title,
      firstimage,
      firstimage2,
      addr1,
      infoNumber,
      mapx,
      mapy,
      overview,
      estiDecoDivCd,
    };
  }

  // 국내여행 검색 목록 조회
  async findKeywordList(
    rows: number,
    page: number,
    keyword: string,
    areaCode: string,
    cat1: string,
    cat2: string,
    user: User,
  ) {
    if (!keyword) {
      throw new BadRequestException('검색어는 필수입니다.');
    }

    areaCode = areaCode ? areaCodeMapper[areaCode] : areaCode;
    cat1 = cat1 ? cat1Mapper[cat1] : cat1;
    cat2 = cat2 ? cat2Mapper[cat2] : cat2;

    if (cat2 && !cat1) {
      throw new BadRequestException(
        '중분류 검색을 위해서는 대분류가 필요합니다.',
      );
    }

    // 키워드 검색 조회 (조회순)
    const { items, pageNo, numOfRows, totalCount } = await this.searchKeyword({
      numOfRows: rows,
      pageNo: page,
      arrange: 'P',
      areaCode,
      cat1,
      cat2,
      keyword,
    });
    const searchKeyword = items.item || {};

    // 개요 포함한 목록
    const searchKeywordDetail = await Promise.all(
      searchKeyword.map(async (item) => {
        const {
          contentid,
          contenttypeid,
          title,
          addr1,
          firstimage,
          firstimage2,
        } = item || {};

        const bookmark = await this.bookmarkService.findOne(contentid, user);
        const isBookmark = bookmark ? true : false;

        const { overview } = await this.detailCommon({
          contentId: contentid,
          overviewYN: 'Y',
        });

        if (contenttypeid != 25 && contenttypeid != 32) {
          return {
            isBookmark,
            contentid,
            contenttypeid,
            title,
            addr1,
            firstimage,
            firstimage2,
            overview,
          };
        }
      }),
    );

    return {
      totalCount,
      pageNo,
      numOfRows,
      items: searchKeywordDetail,
    };
  }
}

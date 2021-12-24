import { BookmarkService } from './../bookmark/bookmark.service';
import { cat2Mapper, cat2ValueMapper } from './mapper/cat2.mapper';
import { cat1Mapper } from './mapper/cat1.mapper';
import { areaCodeMapper } from './mapper/area.mapper';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/user.entity';
import { Bookmark, BookmarkType } from 'src/bookmark/entities/bookmark.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class SearchService {
  constructor(
    private readonly bookmarkService: BookmarkService,

    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  private readonly BASE_URL = `http://api.visitkorea.or.kr/openapi/service/rest`;
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
    return areaBasedList.data.response.body || {};
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

  // 반복정보 조회
  async detailInfo(params: any) {
    const detailInfo = await axios.get(
      `${this.BASE_URL}/KorService/detailInfo?${this.COMMON_QUERY}`,
      {
        params,
      },
    );
    return detailInfo.data.response.body.items.item || {};
  }

  // 관광지별 혼잡도 예측 집계 데이터 정보 조회
  async tarDecoList(params: any) {
    const tarDecoList = await axios.get(
      `${this.BASE_URL}/DataLabService/tarDecoList?${this.COMMON_QUERY}`,
      {
        params,
      },
    );
    const { estiDecoDivCd } = tarDecoList.data.response.body.items.item || {};
    return this.getFormatEstiDecoDivCd(estiDecoDivCd);
  }

  // 오늘의 추천 여행지 조회
  async findTopList() {
    // 오늘의 추천 여행지 목록 선택 알고리즘은 추후 변경해야 함.
    const todayDate = new Date().getDate();

    // 지역 기반 관광 정보 조회 (조회순)
    let areaBaseItemList = await this.areaBasedList({
      numOfRows: 10,
      pageNo: todayDate,
      arrange: 'P',
    });
    areaBaseItemList = areaBaseItemList.items.item || {};

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
      isBookmark: bookmark,
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

  // 북마크 조회
  async findAll(type: BookmarkType, user: User) {
    if (!type) {
      throw new BadRequestException('타입은 필수입니다.');
    }

    const bookmarks = await this.bookmarkRepository.find({ type, user });
    return await Promise.all(
      bookmarks.map(async (item) => {
        const { contentId } = item;
        return await this.findOne(contentId, user);
      }),
    );
  }

  // 국내여행/추천코스 검색 목록 단건 조회
  async findOne(contentid: number, user: User) {
    const bookmark = await this.bookmarkService.findOne(contentid, user);

    const { contenttypeid, title, addr1, firstimage, firstimage2, overview } =
      await this.detailCommon({
        contentId: contentid,
        defaultYN: 'Y',
        firstImageYN: 'Y',
        areacodeYN: 'Y',
        addrinfoYN: 'Y',
        overviewYN: 'Y',
      });

    return {
      isBookmark: bookmark,
      contentid,
      contenttypeid,
      title,
      addr1,
      firstimage,
      firstimage2,
      overview,
    };
  }

  // 국내여행 검색 목록 조회 (검색어 있음/없음 둘 다 구현)
  async findKeywordList(
    rows: number,
    page: number,
    keyword: string,
    areaCode: string,
    cat1: string,
    cat2: string,
    user: User,
  ) {
    areaCode = areaCode ? areaCodeMapper[areaCode] : areaCode;
    cat1 = cat1 ? cat1Mapper[cat1] : cat1;
    cat2 = cat2 ? cat2Mapper[cat2] : cat2;

    if (cat2 && !cat1) {
      throw new BadRequestException(
        '중분류 검색을 위해서는 대분류가 필요합니다.',
      );
    }

    let searchList;
    if (keyword) {
      searchList = await this.searchKeyword({
        numOfRows: rows,
        pageNo: page,
        arrange: 'P',
        areaCode,
        cat1,
        cat2,
        keyword,
      });
    } else {
      searchList = await this.areaBasedList({
        numOfRows: rows,
        pageNo: page,
        arrange: 'P',
        areaCode,
        cat1,
        cat2,
      });
    }

    // 키워드 검색 조회 (조회순)
    const { items, pageNo, numOfRows, totalCount } = searchList;
    const searchItems = items.item || {};

    // 개요 포함한 목록
    const searchDetails = await Promise.all(
      searchItems.map(async (item) => {
        const {
          contentid,
          contenttypeid,
          title,
          addr1,
          firstimage,
          firstimage2,
        } = item || {};

        const bookmark = await this.bookmarkService.findOne(contentid, user);

        const { overview } = await this.detailCommon({
          contentId: contentid,
          overviewYN: 'Y',
        });

        if (contenttypeid != 25 && contenttypeid != 32) {
          return {
            isBookmark: bookmark,
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
      items: searchDetails,
    };
  }

  // 추천코스 상세 조회
  async findCourseDetail(contentid: number, user: User) {
    const bookmark = await this.bookmarkService.findOne(contentid, user);

    const { contenttypeid, title, firstimage, firstimage2, cat2, overview } =
      await this.detailCommon({
        contentId: contentid,
        defaultYN: 'Y',
        firstImageYN: 'Y',
        catcodeYN: 'Y',
        overviewYN: 'Y',
      });

    const { distance, taketime } = await this.detailIntro({
      contentId: contentid,
      contentTypeId: contenttypeid,
    });

    let detailInfo = await this.detailInfo({
      contentId: contentid,
      contentTypeId: contenttypeid,
    });

    detailInfo = detailInfo.map((item) => {
      const { subname, subdetailoverview, subcontentid, subdetailimg } =
        item || {};

      return {
        subcontentid,
        subdetailimg,
        subname,
        subdetailoverview,
      };
    });

    return {
      isBookmark: bookmark,
      contentid,
      title,
      cat2: cat2ValueMapper[cat2],
      firstimage,
      firstimage2,
      overview,
      distance,
      taketime,
      detailInfo,
    };
  }

  // 추천코스 검색 목록 조회 (검색어 있음/없음 둘 다 구현)
  async findCourseList(
    rows: number,
    page: number,
    keyword: string,
    areaCode: string,
    cat2: string,
    user: User,
  ) {
    areaCode = areaCode ? areaCodeMapper[areaCode] : areaCode;
    cat2 = cat2 ? cat2Mapper[cat2] : cat2;

    let searchList;
    if (keyword) {
      searchList = await this.searchKeyword({
        numOfRows: rows,
        pageNo: page,
        arrange: 'P',
        areaCode,
        cat1: cat1Mapper.추천코스,
        cat2,
        keyword,
      });
    } else {
      searchList = await this.areaBasedList({
        numOfRows: rows,
        pageNo: page,
        arrange: 'P',
        areaCode,
        cat1: cat1Mapper.추천코스,
        cat2,
      });
    }

    // 키워드 검색 조회 (조회순)
    const { items, pageNo, numOfRows, totalCount } = searchList;
    const searchItems = items.item || {};

    // 개요 포함한 목록
    const searchDetails = await Promise.all(
      searchItems.map(async (item) => {
        const {
          contentid,
          contenttypeid,
          title,
          addr1,
          firstimage,
          firstimage2,
        } = item || {};

        const bookmark = await this.bookmarkService.findOne(contentid, user);

        const { overview } = await this.detailCommon({
          contentId: contentid,
          overviewYN: 'Y',
        });

        return {
          isBookmark: bookmark,
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

    return {
      totalCount,
      pageNo,
      numOfRows,
      items: searchDetails,
    };
  }
}

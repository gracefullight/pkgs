export {};

declare global {
  namespace Kakao {
    const VERSION: string;

    /**
     * @see https://developers.kakao.com/sdk/reference/js/release/Kakao.html#init
     */
    function init(appKey: string): void;

    /**
     * @see https://developers.kakao.com/sdk/reference/js/release/Kakao.html#isInitialized
     */
    function isInitialized(): boolean;

    /**
     * @see https://developers.kakao.com/sdk/reference/js/release/Kakao.html#cleanup
     */
    function cleanup(): void;

    namespace Auth {
      interface AuthorizeSettings {
        redirectUri?: string;
        state?: string;
        scope?: string;
        prompt?: string;
        nonce?: string;
        throughTalk?: boolean;
      }

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaologin/js#authorize
       */
      function authorize(settings: AuthorizeSettings): void;

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaologin/js#logout
       */
      function logout(): Promise<void>;
    }

    namespace Share {
      interface LinkObject {
        webUrl?: string;
        mobileWebUrl?: string;
        androidExecutionParams?: string;
        iosExecutionParams?: string;
      }

      interface ButtonObject {
        title: string;
        link: LinkObject;
      }

      interface ContentObject {
        title: string;
        description?: string;
        imageUrl: string;
        link: LinkObject;
        imageWidth?: number;
        imageHeight?: number;
      }

      interface SocialObject {
        likeCount?: number;
        commentCount?: number;
        sharedCount?: number;
        viewCount?: number;
        subscriberCount?: number;
      }

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link#default-template-feed
       */
      interface DefaultFeedSettings {
        objectType: "feed";
        content: ContentObject;
        social?: SocialObject;
        buttons?: ButtonObject[];
      }

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link#default-template-text
       */
      interface DefaultTextSettings {
        objectType: "text";
        text: string;
        link: LinkObject;
        buttons?: ButtonObject[];
      }

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link#default-template-commerce
       */
      interface DefaultCommerceSettings {
        objectType: "commerce";
        content: ContentObject;
        commerce: {
          regularPrice: number;
          discountPrice?: number;
          discountRate?: number;
          fixedDiscountPrice?: number;
        };
        buttons?: ButtonObject[];
      }

      type DefaultSettings = DefaultFeedSettings | DefaultTextSettings | DefaultCommerceSettings;

      interface CustomSettings {
        templateId: number;
        templateArgs?: Record<string, string>;
        installTalk?: boolean;
      }

      interface ScrapSettings {
        requestUrl: string;
        templateId?: number;
        templateArgs?: Record<string, string>;
      }

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link#send-default
       */
      function sendDefault(settings: DefaultSettings): Promise<void>;

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link#send-custom
       */
      function sendCustom(settings: CustomSettings): Promise<void>;

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link#send-scrap
       */
      function sendScrap(settings: ScrapSettings): Promise<void>;

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link#create-default-button
       */
      function createDefaultButton(
        settings: DefaultSettings & { container: string | HTMLElement },
      ): void;
    }

    namespace Channel {
      interface ChannelSettings {
        channelPublicId: string;
      }

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-channel/js#add-channel
       */
      function addChannel(settings: ChannelSettings): void;

      /**
       * @see https://developers.kakao.com/docs/latest/ko/kakaotalk-channel/js#chat
       */
      function chat(settings: ChannelSettings): void;
    }
  }

  interface Window {
    Kakao: typeof Kakao;
  }
}
